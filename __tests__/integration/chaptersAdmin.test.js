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
let courseId;

beforeAll(async (done) => {
  const course = {
    name: 'JavaScript',
    image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
    description: 'JavaScript do Zero',
  };

  const resultCourse = await db.query('INSERT INTO courses (name, image, description, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [course.name, course.image, course.description, NOW, NOW]);
  courseId = resultCourse.rows[0].id;

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
  await db.query('DELETE FROM exercises');
  await db.query('DELETE FROM theories');
  await db.query('DELETE FROM topics');
  await db.query('DELETE FROM chapters');
});

afterAll(async () => {
  await db.query('DELETE FROM exercises');
  await db.query('DELETE FROM theories');
  await db.query('DELETE FROM topics');
  await db.query('DELETE FROM chapters');
  await db.query('DELETE FROM "courseUsers"');
  await db.query('DELETE FROM courses');
  await db.query('DELETE FROM users');
  await sequelize.close();
  await db.end();
});

describe('POST /admin/chapters', () => {
  it('should return status 201 and the chapter created when passed valid parameters', async () => {
    const chapterBody = {
      name: 'Introduction',
      courseId,
    };

    const response = await agent.post('/admin/chapters').set({ 'X-Access-Token': tokenAdmin }).send(chapterBody);
    expect(response.status).toBe(201);
    expect.objectContaining({
      name: chapterBody.name,
      createdAt: NOW,
      updatedAt: NOW,
    });
  });

  it('should return 422 when passed invalid parameters', async () => {
    const chapterBody = {
      name: 'Introduction',
      courseId: -1,
    };
    const response = await agent.post('/admin/chapters').set({ 'X-Access-Token': tokenAdmin }).send(chapterBody);
    expect(response.status).toBe(422);
  });
});

describe('PUT /admin/chapters/:id', () => {
  it('should return status 200 and the updated chapter when passed valid parameters', async () => {
    const chapter = {
      name: 'Introduction',
      courseId,
    };

    const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, NOW, NOW]);

    const chapterId = resultChapter.rows[0].id;

    const chapterToBeEdited = {
      name: 'Edited Introduction'
    };
    const response = await agent.put(`/admin/chapters/${chapterId}`).set({ 'X-Access-Token': tokenAdmin }).send(chapterToBeEdited);

    expect(response.status).toBe(200);
    expect.objectContaining({
      id: chapterId,
      name: chapterToBeEdited.name,
      courseId,
    });
  });

  it('should return 422 when passed invalid parameters', async () => {
    const chapter = {
      name: 'Introduction',
      courseId
    };

    const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, NOW, NOW]);

    const chapterId = resultChapter.rows[0].id;

    const chapterToBeEdited = {
      name: 'Edited Introduction',
      courseId: -1
    };

    const response = await agent.put(`/admin/chapters/${chapterId}`).set({ 'X-Access-Token': tokenAdmin }).send(chapterToBeEdited);
    expect(response.status).toBe(422);
  });
});

describe('GET /admin/chapters', () => {
  it('should return 200 and all the chapters', async () => {
    const chapter = {
      name: 'Introduction',
      courseId,
    };

    const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, NOW, NOW]);

    const chapterId = resultChapter.rows[0].id;

    const response = await agent.get('/admin/chapters').set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(200);
    expect(response.headers['access-control-expose-headers']).toBeTruthy();
    expect(response.headers['content-range']).toBeTruthy();
    expect.arrayContaining([{
      id: chapterId,
      name: chapter.name,
      courseId,
    }]);
  });
});

describe('GET /admin/chapters/:id', () => {
  it('should return status 200 and the chapter when passed valid id', async () => {
    const chapter = {
      name: 'Introduction',
      courseId
    };

    const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, NOW, NOW]);

    const chapterId = resultChapter.rows[0].id;

    const response = await agent.get(`/admin/chapters/${chapterId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(200);
    expect(response.headers['access-control-expose-headers']).toBeTruthy();
    expect(response.headers['x-total-count']).toBeTruthy();
    expect.objectContaining({
      id: chapterId,
      name: chapter.name,
      courseId,
    });
  });

  it('should return 403 when passed invalid id', async () => {
    const chapterId = -1;
    const response = await agent.get(`/admin/topics/${chapterId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(403);
  });
});

describe('DELETE /admin/chapters/:id', () => {
  it('should return 202 when passed valid id', async () => {
    const chapter = {
      name: 'Introduction',
      courseId,
    };

    const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, NOW, NOW]);

    const chapterId = resultChapter.rows[0].id;

    const response = await agent.delete(`/admin/chapters/${chapterId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(202);
  });

  it('should return 403 when passed valid id', async () => {
    const chapterId = -1;
    const response = await agent.delete(`/admin/chapters/${chapterId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(403);
  });
});
