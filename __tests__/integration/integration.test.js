/* global jest, describe, it, expect, beforeAll, afterAll */
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();
const { Pool } = require('pg');
const supertest = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeEach(async () => {
  await db.query('DELETE FROM users');
});

afterAll(async () => {
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
    await db.query('INSERT INTO users (name, email, password, type) values ($1, $2, $3, $4)', [body.name, body.email, body.password, 'CLIENT']);

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

    await db.query('INSERT INTO users (name, email, password, type) values ($1, $2, $3, $4)', ['Test', bodyLogin.email, bcrypt.hashSync(bodyLogin.password, 10), 'CLIENT']);

    const response = await agent.post('/clients/signin').send(bodyLogin);
    
    expect(response.status).toBe(200);
  });

  it('should return 400 when passed invalid parameters', async () => {
    const body = {
      email: 'testasdasas.com',
      password: '123456',
    };

    const response = await agent.post('/clients/signin').send(body);

    expect(response.status).toBe(400);
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

    await db.query('INSERT INTO users (name, email, password, type) values ($1, $2, $3, $4)', [bodyAdmin.name, bodyAdmin.email, bodyAdmin.password, 'ADMIN']);

    const bodyLogin = {
      email: 'contato@codify.com.br',
      password: '123456',
    };

    const response = await agent.post('/admin/signin').send(bodyLogin);
    
    expect(response.status).toBe(200);
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
