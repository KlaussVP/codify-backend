/* global describe, it, expect, beforeEach, beforeAll afterAll */
const dotenv = require('dotenv');

dotenv.config();
const { Pool } = require('pg');
const { NOW } = require('sequelize');
const supertest = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

let tokenAdmin;

beforeAll(async (done) => {
  const bodyAdmin = {
    name: 'admin',
    email: 'contato@codify.com.br',
    password: '123456',
    confirmPassword: '123456',
  };

  await db.query('INSERT INTO users (name, email, password, type, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6)', [bodyAdmin.name, bodyAdmin.email, bodyAdmin.password, 'ADMIN', 'now()', 'now()']);

  agent
    .post('/admin/signin').send({
      email: 'contato@codify.com.br',
      password: '123456',
    })
    .end((err, response) => {
      tokenAdmin = response.body.token;
      done();
    });
});

beforeEach(async () => {
  await db.query('DELETE FROM topics');
  await db.query('DELETE FROM chapters');
  await db.query('DELETE FROM "courseUsers"');
  await db.query('DELETE FROM courses');
});

afterAll(async () => {
  await db.query('DELETE FROM topics');
  await db.query('DELETE FROM chapters');
  await db.query('DELETE FROM "courseUsers"');
  await db.query('DELETE FROM courses');
  await db.query('DELETE FROM users');
  await sequelize.close();
  await db.end();
});

describe('POST /admin/courses', () => {
  it('should return 201 when passed valid parameters', async () => {
    const body = {
      name: 'JavaScripter',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    const response = await agent.post('/admin/courses').set({ 'X-Access-Token': tokenAdmin }).send(body);
    expect(response.status).toBe(201);
    expect.objectContaining({
      id: expect.any(Number),
      name: 'JavaScripter',
      deleted: false,
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      createdAt: NOW,
      updatedAt: NOW,
    });
  });

  it('should return 422 when passed invalid parameters', async () => {
    const body = {
      name: 'JavaScripter',
      image: 'não é uma URL de imagem',
      description: 'JavaScript do Zero',
    };
    const response = await agent.post('/admin/courses').set({ 'X-Access-Token': tokenAdmin }).send(body);
    expect(response.status).toBe(422);
  });

  it('should return 409 when name already exists', async () => {
    const body = {
      name: 'JavaScript2',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    await db.query('INSERT INTO courses (name, image, description) values ($1, $2, $3)', [body.name, body.image, body.description]);

    const response = await agent.post('/admin/courses').set({ 'X-Access-Token': tokenAdmin }).send(body);

    expect(response.status).toBe(409);
  });
});

describe('PUT /admin/courses/:id', () => {
  it('should return 200 when passed valid parameters', async () => {
    const course = {
      name: 'JavaScript21122',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    const resultCourse = await db.query('INSERT INTO courses (name, image, description, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [course.name, course.image, course.description, NOW, NOW]);

    const courseId = resultCourse.rows[0].id;

    const courseToBeEdited = {
      id: courseId,
      name: 'JavaScript EDITADO ',
    };
    const response = await agent.put(`/admin/courses/${courseId}`).set({ 'X-Access-Token': tokenAdmin }).send(courseToBeEdited);

    expect(response.status).toBe(200);
    expect.objectContaining({
      id: courseId,
      name: courseToBeEdited.name,
      deleted: false,
      image: course.image,
      description: course.description,
    });
  });

  it('should return 422 when passed invalid parameters', async () => {
    const course = {
      name: 'JavaScript21122',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    const resultCourse = await db.query('INSERT INTO courses (name, image, description, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [course.name, course.image, course.description, NOW, NOW]);

    const courseId = resultCourse.rows[0].id;

    const courseToBeEdited = {
      id: courseId,
      image: 'Não é uma URL',
    };
    const response = await agent.put(`/admin/courses/${courseId}`).set({ 'X-Access-Token': tokenAdmin }).send(courseToBeEdited);
    expect(response.status).toBe(422);
  });

  it('should return 409 when name already exists', async () => {
    const course = {
      name: 'JavaScript MESMO NOME',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    const resultCourse = await db.query('INSERT INTO courses (name, image, description, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [course.name, course.image, course.description, NOW, NOW]);

    const courseId = resultCourse.rows[0].id;

    const courseToBeEdited = {
      id: courseId,
      name: 'JavaScript MESMO NOME',
    };

    const response = await agent.put(`/admin/courses/${courseId}`).set({ 'X-Access-Token': tokenAdmin }).send(courseToBeEdited);
    expect(response.status).toBe(409);
  });
});

describe('DELETE /admin/courses/:id', () => {
  it('should return 202 when passed valid Id', async () => {
    const course = {
      name: 'JavaScript21122',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };

    const resultCourse = await db.query('INSERT INTO courses (name, image, description, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [course.name, course.image, course.description, NOW, NOW]);
    const courseId = resultCourse.rows[0].id;

    const response = await agent.delete(`/admin/courses/${courseId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(202);
    expect.objectContaining({
      id: courseId,
      name: course.name,
      deleted: true,
      image: course.image,
      description: course.description,
    });
  });

  it('should return 403 when passed valid Id', async () => {
    const courseId = -999;
    const response = await agent.delete(`/admin/courses/${courseId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(403);
  });
});

describe('GET /admin/courses/:id', () => {
  it('should return 200 when passed valid Id', async () => {
    const course = {
      name: 'JavaScript21122',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    const chapter = { name: 'Apresentação Programação' };

    const resultCourse = await db.query('INSERT INTO courses (name, image, description, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [course.name, course.image, course.description, NOW, NOW]);
    const courseId = resultCourse.rows[0].id;

    const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, NOW, NOW]);
    const chapterId = resultChapter.rows[0].id;

    const response = await agent.get(`/admin/courses/${courseId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(200);
    expect(response.headers['access-control-expose-headers']).toBeTruthy();
    expect(response.headers['x-total-count']).toBeTruthy();
    expect.objectContaining({
      id: courseId,
      name: course.name,
      deleted: false,
      image: course.image,
      description: course.description,
      chapters: [chapterId],
    });
  });

  it('should return 403 when passed valid Id', async () => {
    const courseId = -999;
    const response = await agent.get(`/admin/courses/${courseId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(403);
  });
});

describe('GET /admin/courses/', () => {
  it('should return 200', async () => {
    const course = {
      name: 'JavaScript21122',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    const chapter = { name: 'Apresentação Programação' };

    const resultCourse = await db.query('INSERT INTO courses (name, image, description, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [course.name, course.image, course.description, NOW, NOW]);
    const courseId = resultCourse.rows[0].id;

    const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, NOW, NOW]);
    const chapterId = resultChapter.rows[0].id;

    const response = await agent.get('/admin/courses').set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(200);
    expect(response.headers['access-control-expose-headers']).toBeTruthy();
    expect(response.headers['content-range']).toBeTruthy();
    expect.arrayContaining([{
      id: courseId,
      name: course.name,
      deleted: false,
      image: course.image,
      description: course.description,
      chapters: [chapterId],
    }]);
  });
});
