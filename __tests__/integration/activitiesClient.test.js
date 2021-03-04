/* global describe, it, expect, beforeEach, beforeAll afterAll */
const dotenv = require('dotenv');

dotenv.config();
const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const { NOW } = require('sequelize');
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
    user.name, user.email, user.password, Sequelize.NOW, Sequelize.NOW, 'CLIENT',
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

  const resultTheory = await db.query('INSERT INTO theories ("youtubeLink", "topicId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', ['https://www.youtube.com/watch?v=efWrIyjmCXg', topicId, NOW, NOW]);
  const theoryId = resultTheory.rows[0].id;

  const resultExercise = await db.query('INSERT INTO exercises ("baseCode", "topicId", "createdAt", "updatedAt", "testCode", "statement", "solutionCode", position) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', ['Base Code', topicId, NOW, NOW, 'Test Code', 'Statement', 'Solution Code', 1]);
  const exerciseId = resultExercise.rows[0].id;

  return {
    courseId,
    chapterId,
    topicId,
    theoryId,
    exerciseId,
  };
}

beforeEach(async () => {
  await db.query('DELETE FROM "theoryUsers"');
  await db.query('DELETE FROM "exerciseUsers"');
  await db.query('DELETE FROM exercises');
  await db.query('DELETE FROM theories');
  await db.query('DELETE FROM topics');
  await db.query('DELETE FROM chapters');
  await db.query('DELETE FROM "courseUsers"');
  await db.query('DELETE FROM courses');
  await db.query('DELETE FROM users');
});

afterAll(async () => {
  await db.query('DELETE FROM "theoryUsers"');
  await db.query('DELETE FROM "exerciseUsers"');
  await db.query('DELETE FROM topics');
  await db.query('DELETE FROM chapters');
  await db.query('DELETE FROM "courseUsers"');
  await db.query('DELETE FROM courses');
  await db.query('DELETE FROM users');
  await sequelize.close();
  await db.end();
});

describe('POST /clients/activities/theory/:id', () => {
  it('should return 200 when passed valid Id', async () => {
    const tokenClient = await getToken();
    const ids = await insertCompleteCourse();
    const response = await agent.post(`/clients/activities/theory/${ids.theoryId}`).set({ 'X-Access-Token': tokenClient });

    expect(response.status).toBe(200);
  });

  it('should return status 403 when passed invalid id', async () => {
    const tokenClient = await getToken();
    const response = await agent.post('/clients/activities/theory/1').set({ 'X-Access-Token': tokenClient });
    expect(response.status).toBe(403);
  });
});

describe('POST /clients/activities/exercise/:id', () => {
  it('should return 200 when passed valid Id', async () => {
    const tokenClient = await getToken();
    const ids = await insertCompleteCourse();
    const response = await agent.post(`/clients/activities/exercise/${ids.exerciseId}`).set({ 'X-Access-Token': tokenClient });

    expect(response.status).toBe(200);
  });

  it('should return status 403 when passed invalid id', async () => {
    const tokenClient = await getToken();
    await insertCompleteCourse();
    const response = await agent.post('/clients/activities/exercise/1').set({ 'X-Access-Token': tokenClient });
    expect(response.status).toBe(403);
  });
});
