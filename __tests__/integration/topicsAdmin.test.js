/* global describe, it, expect, beforeEach, beforeAll afterAll */
const dotenv = require('dotenv');

dotenv.config();
const { Pool } = require('pg');
const { NUMBER } = require('sequelize');
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
let chapterId;

beforeAll(async (done) => {
  const course = {
    name: 'JavaScript',
    image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
    description: 'JavaScript do Zero',
  };
  const chapter = { name: 'Apresentação Programação' };

  const resultCourse = await db.query('INSERT INTO courses (name, image, description, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [course.name, course.image, course.description, NOW, NOW]);
  courseId = resultCourse.rows[0].id;

  const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, NOW, NOW]);
  chapterId = resultChapter.rows[0].id;

  const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['Teste', chapterId, NOW, NOW]);
  const topicId = resultTopic.rows[0].id;

  const resultTheory = await db.query('INSERT INTO theories ("youtubeLink", "topicId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['https://www.youtube.com/watch?v=efWrIyjmCXg', topicId, NOW, NOW]);
  const theoryId = resultTheory.rows[0].id;

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

describe('POST /admin/topics', () => {
  it('should return 201 when passed valid parameters', async () => {
    const topicBody = {
      name: 'Introduction JS',
      chapterId,
      youtubeLink: 'https://www.youtube.com/watch?v=efWrIyjmCXg',
    };

    const response = await agent.post('/admin/topics').set({ 'X-Access-Token': tokenAdmin }).send(topicBody);
    expect(response.status).toBe(201);
    expect.objectContaining({
      id: expect.any(Number),
      name: topicBody.name,
      createdAt: NOW,
      updatedAt: NOW,
      theory: {
        id: expect.any(Number),
        youtubeLink: topicBody.youtubeLink,
      },
    });
  });

  it('should return 422 when passed invalid parameters', async () => {
    const topicBody = {
      name: 'Introduction JS',
      chapterId: -9999,
    };
    const response = await agent.post('/admin/topics').set({ 'X-Access-Token': tokenAdmin }).send(topicBody);
    expect(response.status).toBe(422);
  });
});

describe('PUT /admin/topics/:id', () => {
  it('should return 200 when passed valid parameters', async () => {
    const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['Introduction JS', chapterId, NOW, NOW]);

    const topicId = resultTopic.rows[0].id;

    const resultTheory = await db.query('INSERT INTO theories ("youtubeLink", "topicId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['https://www.youtube.com/watch?v=efWrIyjmCXg', topicId, NOW, NOW]);
    const theoryId = resultTheory.rows[0].id;

    const topicToBeEdited = {
      id: topicId,
      name: 'Introdução EDITADO ',
      theory: {
        id: theoryId,
      },
    };
    const response = await agent.put(`/admin/topics/${topicId}`).set({ 'X-Access-Token': tokenAdmin }).send(topicToBeEdited);

    expect(response.status).toBe(200);
    expect.objectContaining({
      id: topicId,
      name: topicToBeEdited.name,
      chapterId,
      theory: {
        id: theoryId,
        youtubeLink: resultTheory.rows[0].youtubeLink,
      },
    });
  });

  it('should return 422 when passed id smaller than 0', async () => {
    const topicBody = {
      name: 'Introduction JS',
      chapterId: -9999,
    };

    const response = await agent.put('/admin/topics/1').set({ 'X-Access-Token': tokenAdmin }).send(topicBody);
    expect(response.status).toBe(422);
  });
});

describe('DELETE /admin/topics/:id', () => {
  it('should return 202 when passed valid Id', async () => {
    const topic = {
      name: 'Introduction JS',
      chapterId,
    };

    const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [topic.name, chapterId, NOW, NOW]);

    const topicId = resultTopic.rows[0].id;

    const response = await agent.delete(`/admin/topics/${topicId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(202);
  });

  it('should return 403 when passed valid Id', async () => {
    const topicId = -999;
    const response = await agent.delete(`/admin/topics/${topicId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(403);
  });
});

describe('GET /admin/topics/:id', () => {
  it('should return 200 when passed valid Id', async () => {
    const topic = {
      name: 'Introduction JS',
      chapterId,
    };

    const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [topic.name, chapterId, NOW, NOW]);

    const topicId = resultTopic.rows[0].id;

    const response = await agent.get(`/admin/topics/${topicId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(200);
    expect(response.headers['access-control-expose-headers']).toBeTruthy();
    expect(response.headers['x-total-count']).toBeTruthy();
    expect.objectContaining({
      id: topicId,
      name: topic.name,
      chapterId,
    });
  });

  it('should return 403 when passed invalid Id', async () => {
    const topicId = -999;
    const response = await agent.get(`/admin/topics/${topicId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(403);
  });
});

describe('GET /admin/topics', () => {
  it('should return 200', async () => {
    const topic = {
      name: 'Introduction JS',
      chapterId,
    };

    const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [topic.name, chapterId, NOW, NOW]);

    const topicId = resultTopic.rows[0].id;

    const response = await agent.get('/admin/topics').set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(200);
    expect(response.headers['access-control-expose-headers']).toBeTruthy();
    expect(response.headers['content-range']).toBeTruthy();
    expect.arrayContaining([{
      id: topicId,
      name: topic.name,
      chapterId,
    }]);
  });
});
