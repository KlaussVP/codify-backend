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

describe('PUT /admin/theories/:id', () => {
  it('should return 200 when passed valid parameters', async () => {
    const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['Introduction JS', chapterId, NOW, NOW]);
    const topicId = resultTopic.rows[0].id;

    const resultTheory = await db.query('INSERT INTO theories ("youtubeLink", "topicId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['https://www.youtube.com/watch?v=efWrIyjmCXg', topicId, NOW, NOW]);
    const theoryId = resultTheory.rows[0].id;

    const theoryToBeEdited = {
      id: theoryId,
      youtubeLink: 'https://www.youtube.com/watch?v=08X9gf3mdKY',
    };
    const response = await agent.put(`/admin/theories/${theoryId}`).set({ 'X-Access-Token': tokenAdmin }).send(theoryToBeEdited);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      id: theoryId,
      youtubeLink: theoryToBeEdited.youtubeLink,
    }));
  });

  it('should return 422 when passed invalid parameters', async () => {
    const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['Introduction JS', chapterId, NOW, NOW]);
    const topicId = resultTopic.rows[0].id;

    const resultTheory = await db.query('INSERT INTO theories ("youtubeLink", "topicId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['https://www.youtube.com/watch?v=efWrIyjmCXg', topicId, NOW, NOW]);
    const theoryId = resultTheory.rows[0].id;

    const theoryBody = {
      id: theoryId,
      youtubeLink: 1,
    };

    const response = await agent.put(`/admin/theories/${theoryId}`).set({ 'X-Access-Token': tokenAdmin }).send(theoryBody);
    expect(response.status).toBe(422);
  });
});

describe('GET /admin/theories/:id', () => {
  it('should return 200 when passed valid Id', async () => {
    const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['Teste', chapterId, NOW, NOW]);
    const topicId = resultTopic.rows[0].id;

    const theory = {
      youtubeLink: 'https://www.youtube.com/watch?v=08X9gf3mdKY',
      topicId,
    };

    const resultTheory = await db.query('INSERT INTO theories ("youtubeLink", "topicId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [theory.youtubeLink, topicId, NOW, NOW]);
    const theoryId = resultTheory.rows[0].id;

    const response = await agent.get(`/admin/theories/${theoryId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(200);
    expect(response.headers['access-control-expose-headers']).toBeTruthy();
    expect(response.headers['x-total-count']).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({
      id: theoryId,
      youtubeLink: theory.youtubeLink,
      topicId: theory.topicId,
    }));
  });

  it('should return 403 when passed invalid Id', async () => {
    const theoryId = -999;
    const response = await agent.get(`/admin/theories/${theoryId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(403);
  });
});

describe('GET /admin/theories', () => {
  it('should return 200', async () => {
    const topic = {
      name: 'Introduction JS',
      chapterId,
    };

    const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [topic.name, chapterId, NOW, NOW]);
    const topicId = resultTopic.rows[0].id;

    const theory = {
      youtubeLink: 'https://www.youtube.com/watch?v=08X9gf3mdKY',
      topicId,
    };

    const resultTheory = await db.query('INSERT INTO theories ("youtubeLink", "topicId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [theory.youtubeLink, topicId, NOW, NOW]);
    const theoryId = resultTheory.rows[0].id;

    const response = await agent.get('/admin/theories').set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(200);
    expect(response.headers['access-control-expose-headers']).toBeTruthy();
    expect(response.headers['content-range']).toBeTruthy();
    expect(response.body).toEqual(expect.arrayContaining([{
      id: theoryId,
      youtubeLink: theory.youtubeLink,
      topicId,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      topic: {
        name: resultTopic.rows[0].name,
        chapter: {
          id: chapterId,
          course: {
            id: courseId,
          },
        },
      },
    }]));
  });
});

