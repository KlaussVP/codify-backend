/* global describe, it, expect, beforeEach, beforeAll afterAll */
const dotenv = require('dotenv');

dotenv.config();
const { Pool } = require('pg');
const { NOW } = require('sequelize');
const supertest = require('supertest');
const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');
const sessionStore = require('../../src/repositories/sessionStore');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getToken() {
  const user = {
    name: 'Teste Silva',
    email: 'teste@teste.com',
    password: 'senha_super_secreta_de_teste',
  };

  const testUser = await db.query('INSERT INTO users (name, email, password, "createdAt", "updatedAt", type) values ($1, $2, $3, $4, $5, $6) RETURNING *', [
    user.name, user.email, user.password, Sequelize.NOW, Sequelize.NOW, 'ADMIN',
  ]);

  const token = jwt.sign({ id: testUser.rows[0].id }, process.env.SECRET, {
    expiresIn: 86400,
  });

  const userData = {
    id: testUser.rows[0].id,
    token,
    type: testUser.rows[0].type,
    name: testUser.rows[0].name,
  };

  await sessionStore.setSession(token, userData);

  return token;
}

async function insertCompleteCourse() {
  const course = {
    name: 'JavaScript',
    image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
    description: 'JavaScript do Zero',
  };
  const chapter = { name: 'Apresentação Programação' };

  const resultCourse = await db.query('INSERT INTO courses (name, image, description, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [course.name, course.image, course.description, NOW, NOW]);
  const courseId = resultCourse.rows[0].id;

  const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, NOW, NOW]);
  const chapterId = resultChapter.rows[0].id;

  const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['Introduction JS', chapterId, NOW, NOW]);
  const topicId = resultTopic.rows[0].id;

  const resultExercise = await db.query('INSERT INTO exercises ("baseCode", "topicId", "createdAt", "updatedAt", "testCode", "statement", "solutionCode", position) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', ['Base Code', topicId, NOW, NOW, 'Test Code', 'Statement', 'Solution Code', 1]);
  const exerciseId = resultExercise.rows[0].id;

  return {
    courseId,
    chapterId,
    topicId,
    exerciseId,
  };
}

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

describe('GET /admin/exercises', () => {
  it('should return 200', async () => {
    const tokenAdmin = await getToken();
    const ids = await insertCompleteCourse();

    const response = await agent.get('/admin/exercises').set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(200);
    expect(response.headers['access-control-expose-headers']).toBeTruthy();
    expect(response.headers['content-range']).toBeTruthy();
    expect(response.body).toEqual(expect.arrayContaining([{
      id: ids.exerciseId,
      baseCode: expect.any(String),
      topicId: ids.topicId,
      testCode: expect.any(String),
      solutionCode: expect.any(String),
      statement: expect.any(String),
      position: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      topic: {
        name: expect.any(String),
        chapter: {
          id: ids.chapterId,
          course: {
            id: ids.courseId,
          },
        },
      },
    }]));
  });
});

describe('GET /admin/exercises/:id', () => {
  it('should return 200 when passed valid Id', async () => {
    const tokenAdmin = await getToken();
    const ids = await insertCompleteCourse();

    const response = await agent.get(`/admin/exercises/${ids.exerciseId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(200);
    expect(response.headers['access-control-expose-headers']).toBeTruthy();
    expect(response.headers['x-total-count']).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({
      id: ids.exerciseId,
      baseCode: expect.any(String),
      topicId: ids.topicId,
      testCode: expect.any(String),
      solutionCode: expect.any(String),
      statement: expect.any(String),
      position: 1,
    }));
  });

  it('should return 403 when passed invalid Id', async () => {
    const tokenAdmin = await getToken();
    insertCompleteCourse();
    const exerciseId = -999;
    const response = await agent.get(`/admin/exercises/${exerciseId}`).set({ 'X-Access-Token': tokenAdmin });

    expect(response.status).toBe(403);
  });
});

describe('POST /admin/exercises', () => {
  it('should return 201 when passed valid parameters', async () => {
    const tokenAdmin = await getToken();
    const ids = await insertCompleteCourse();
    const body = {
      topicId: ids.topicId,
      baseCode: 'Base Code 2',
      testCode: 'Test Code 2',
      solutionCode: 'Solution Code 2',
      statement: 'Statement Code',
      position: 2,
    };

    const response = await agent.post('/admin/exercises').set({ 'X-Access-Token': tokenAdmin }).send(body);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      topicId: ids.topicId,
      baseCode: 'Base Code 2',
      testCode: 'Test Code 2',
      solutionCode: 'Solution Code 2',
      statement: 'Statement Code',
      position: 2,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    }));
  });

  it('should return 422 when passed invalid parameters', async () => {
    const tokenAdmin = await getToken();
    const ids = await insertCompleteCourse();
    const body = {
      topicId: ids.topicId,
      baseCode: 'Base Code 2',
      testCode: 'Test Code 2',
    };
    const response = await agent.post('/admin/topics').set({ 'X-Access-Token': tokenAdmin }).send(body);
    expect(response.status).toBe(422);
  });
});
