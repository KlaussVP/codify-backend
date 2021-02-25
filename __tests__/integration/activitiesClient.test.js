/* global describe, it, expect, beforeEach, beforeAll afterAll */
const dotenv = require('dotenv');

dotenv.config();
const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
const supertest = require('supertest');
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
    const course = {
      name: 'JavaScript21122',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    const chapter = {
      name: 'Apresentação Programação',
      topics: [
        {
          name: 'Introdução a programação',
        },
      ],
    };
    const theory = {
      youtubeLink: 'https://www.youtube.com/embed/Ptbk2af68e8',
    };

    const resultCourse = await db.query('INSERT INTO courses (name, image, description) values ($1, $2, $3) RETURNING *', [course.name, course.image, course.description]);
    const courseId = resultCourse.rows[0].id;

    const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, Sequelize.NOW, Sequelize.NOW]);
    const chapterId = resultChapter.rows[0].id;

    const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.topics[0].name, chapterId, Sequelize.NOW, Sequelize.NOW]);
    const topicId = resultTopic.rows[0].id;

    const resultTheory = await db.query('INSERT INTO theories ("youtubeLink", "topicId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [theory.youtubeLink, topicId, Sequelize.NOW, Sequelize.NOW]);
    const theoryId = resultTheory.rows[0].id;

    const response = await agent.post(`/clients/activities/theory/${theoryId}`).set({ 'X-Access-Token': tokenClient });

    expect(response.status).toBe(201);
  });

  it('should return status 403 when passed invalid id', async () => {
    const tokenClient = await getToken();
    const response = await agent.post('/clients/activities/theory/1').set({ 'X-Access-Token': tokenClient });
    expect(response.status).toBe(403);
  });
});
