/* global describe, it, expect, afterAll, beforeEach */
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const { Pool } = require('pg');
const uuid = require('uuid');
const sessionStore = require('../../src/repositories/sessionStore');

const app = require('../../src/app');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeEach(async () => {
  await db.query('DELETE FROM "courseUsers";');
  await db.query('DELETE FROM users;');
});

afterAll(async () => {
  await db.query('DELETE FROM users;');
  await db.query('DELETE FROM users;');
  await sequelize.close();
  await db.end();
});

describe('POST /clients/signup', () => {
  it('should return 201 when passed valid parameters', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    };
    const response = await agent.post('/clients/signup').send(body);

    expect(response.status).toBe(201);
  });

  it('should return 422 when passed invalid parameters', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '1234567',
    };
    const response = await agent.post('/clients/signup').send(body);

    expect(response.status).toBe(422);
    expect(response.body.error).toBe('Senhas diferentes.');
  });

  it('should return 409 when email already exists', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    };
    await db.query('INSERT INTO users (name, email, password, type, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6)', [body.name, body.email, body.password, 'CLIENT', 'now()', 'now()']);

    const response = await agent.post('/clients/signup').send(body);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Conflito de dados.');
  });
});

describe('POST /clients/signin', () => {
  it('should return 200 when passed valid login data', async () => {
    const bodyLogin = {
      email: 'test@test.com',
      password: '123456',
    };

    const resultUser = await db.query('INSERT INTO users (name, email, password, type, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6) RETURNING *', ['Test', bodyLogin.email, bcrypt.hashSync(bodyLogin.password, 10), 'CLIENT', 'now()', 'now()']);

    const userId = resultUser.rows[0].id;

    const response = await agent.post('/clients/signin').send(bodyLogin);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: userId,
        token: expect.any(String),
        type: 'CLIENT',
        name: 'Test',
      }),
    );
  });

  it('should return 422 when passed invalid parameters', async () => {
    const body = {
      email: 'testasdasas.com',
      password: '123456',
    };

    const response = await agent.post('/clients/signin').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 403 when passed wrong password', async () => {
    const body = {
      email: 'test@test.com',
      password: '00000000',
    };

    const response = await agent.post('/clients/signin').send(body);

    expect(response.status).toBe(401);
  });
});

describe('POST /admin/signin', () => {
  it('should return 200 when passed valid login data', async () => {
    const bodyAdmin = {
      name: 'admin',
      email: 'contato@codify.com.br',
      password: '123456',
      confirmPassword: '123456',
    };

    const resultUser = await db.query('INSERT INTO users (name, email, password, type, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6) RETURNING *', [bodyAdmin.name, bodyAdmin.email, bodyAdmin.password, 'ADMIN', 'now()', 'now()']);

    const userId = resultUser.rows[0].id;

    const bodyLogin = {
      email: 'contato@codify.com.br',
      password: '123456',
    };

    const response = await agent.post('/admin/signin').send(bodyLogin);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: userId,
        token: expect.any(String),
        type: 'ADMIN',
        name: bodyAdmin.name,
      }),
    );
  });

  it('should return 400 when passed invalid parameters', async () => {
    const body = {
      email: 'testasdasas.com',
      password: '123456',
    };

    const response = await agent.post('/admin/signin').send(body);

    expect(response.status).toBe(400);
  });

  it('should return 403 when passed wrong password', async () => {
    const body = {
      email: 'contato@codify.com.br',
      password: '00000000',
    };

    const response = await agent.post('/admin/signin').send(body);

    expect(response.status).toBe(401);
  });

  it('should return 403 when wrong user type', async () => {
    const bodyLogin = {
      email: 'test@test.com',
      password: '123456',
    };

    const response = await agent.post('/admin/signin').send(bodyLogin);

    expect(response.status).toBe(401);
  });
});

describe('POST /clients/logout', () => {
  it('should return 200 when token exists in Redis', async () => {
    const bodyLogin = {
      email: 'test@test.com',
      password: '123456',
    };

    const resultUser = await db.query('INSERT INTO users (name, email, password, type, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6) RETURNING *', ['Test', bodyLogin.email, bcrypt.hashSync(bodyLogin.password, 10), 'CLIENT', 'now()', 'now()']);

    const userId = resultUser.rows[0].id;
    const token = jwt.sign({ id: userId }, process.env.SECRET, {
      expiresIn: 86400,
    });

    const userData = {
      id: userId,
      token,
      type: 'CLIENT',
      name: 'Test',
    };

    await sessionStore.setSession(token, userData);

    const response = await agent.post('/clients/logout').set({ 'x-access-token': token });
    expect(response.status).toBe(200);
  });
});

describe('POST /admin/logout', () => {
  it('should return 200 when token exists in Redis', async () => {
    const bodyAdmin = {
      name: 'admin',
      email: 'contato@codify.com.br',
      password: '123456',
      confirmPassword: '123456',
    };

    const resultUser = await db.query('INSERT INTO users (name, email, password, type, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6) RETURNING *', [bodyAdmin.name, bodyAdmin.email, bodyAdmin.password, 'ADMIN', 'now()', 'now()']);

    const userId = resultUser.rows[0].id;
    const token = jwt.sign({ id: userId }, process.env.SECRET, {
      expiresIn: 86400,
    });

    const userData = {
      id: userId,
      token,
      type: 'ADMIN',
      name: bodyAdmin.name,
    };

    await sessionStore.setSession(token, userData);

    const response = await agent.post('/admin/logout').set({ 'x-access-token': token });
    expect(response.status).toBe(200);
  });
});

describe('POST /clients/new-password', () => {
  it('should return 200 when data is valid and token exists in Redis', async () => {
    const bodyNewPassword = {
      token: uuid.v4(),
      password: 'new-password',
      confirmPassword: 'new-password',
    };

    const newUser = {
      name: 'test',
      email: 'lg@gmail.com',
      password: '123456',
    };

    const resultUser = await db.query('INSERT INTO users (name, email, password, type, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6) RETURNING *', [newUser.name, newUser.email, bcrypt.hashSync(newUser.password, 10), 'CLIENT', 'now()', 'now()']);

    const userId = resultUser.rows[0].id;

    await sessionStore.setSession(bodyNewPassword.token, userId);

    const response = await agent.post('/clients/new-password').send(bodyNewPassword);
    expect(response.status).toBe(200);
  });

  it('should return 422 when token is not uuid v4', async () => {
    const bodyNewPassword = {
      token: 'token is not a v4 uuid',
      password: 'new-password',
      confirmPassword: 'new-password',
    };

    const newUser = {
      name: 'test',
      email: 'lg@gmail.com',
      password: '123456',
    };

    await db.query('INSERT INTO users (name, email, password, type, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6) RETURNING *', [newUser.name, newUser.email, bcrypt.hashSync(newUser.password, 10), 'CLIENT', 'now()', 'now()']);

    const response = await agent.post('/clients/new-password').send(bodyNewPassword);
    expect(response.status).toBe(422);
  });

  it('should return 401 when uuid is not registerd in Redis', async () => {
    const bodyNewPassword = {
      token: uuid.v4(),
      password: 'new-password',
      confirmPassword: 'new-password',
    };

    const newUser = {
      name: 'test',
      email: 'lg@gmail.com',
      password: '123456',
    };

    await db.query('INSERT INTO users (name, email, password, type, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6) RETURNING *', [newUser.name, newUser.email, bcrypt.hashSync(newUser.password, 10), 'CLIENT', 'now()', 'now()']);

    const response = await agent.post('/clients/new-password').send(bodyNewPassword);
    expect(response.status).toBe(401);
  });
});
