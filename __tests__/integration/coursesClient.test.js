/* global describe, it, expect, beforeEach, beforeAll afterAll */
const dotenv = require('dotenv');

dotenv.config();
const { Pool } = require('pg');
const { NOW, Sequelize } = require('sequelize');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const verifyJWT = require('../../src/middlewares/authMiddleware');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
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

describe('GET /clients/courses/:id', () => {
  it('should return 200 when passed valid Id', async () => {
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
    const resultCourse = await db.query('INSERT INTO courses (name, image, description) values ($1, $2, $3) RETURNING *', [course.name, course.image, course.description]);
    const courseId = resultCourse.rows[0].id;

    const resultChapter = await db.query('INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.name, courseId, Sequelize.NOW, Sequelize.NOW]);
    const chapterId = resultChapter.rows[0].id;

    const resultTopic = await db.query('INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *', [chapter.topics[0].name, chapterId, Sequelize.NOW, Sequelize.NOW]);
    const topicId = resultTopic.rows[0].id;

    const response = await agent.get(`/clients/courses/${courseId}`);

    expect(response.status).toBe(200);
    expect.objectContaining({
      id: courseId,
      name: course.name,
      deleted: false,
      image: course.image,
      description: course.description,
      chapters: [
        {
          id: chapterId,
          name: chapter.name,
          topics: [
            {
              id: topicId,
              name: chapter.topics.name,
            },
          ],
        },
      ],
    });
  });
});

describe('GET /clients/courses', () => {
  it('should return 200 with courses array', async () => {
    const course = {
      name: 'JavaScriptOne',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };

    const resultCourse = await db.query('INSERT INTO courses (name, image, description) values ($1, $2, $3) RETURNING *', [course.name, course.image, course.description]);
    const courseId = resultCourse.rows[0].id;

    const response = await agent.get('/clients/courses');

    expect(response.status).toBe(200);
    expect.arrayContaining({
      id: courseId,
      name: course.name,
      deleted: false,
      image: course.image,
      description: course.description,
    });
  });
});

describe('POST /clients/courses/:id', () => {
  it('should return 200 when course is successfully started or resumed', async () => {
    const user = {
      name: 'Teste Silva',
      email: 'teste@teste.com',
      password: 'senha_super_secreta_de_teste',
    };

    const course = {
      name: 'TesteScript do zero!',
      description: 'Aprenda TesteScript do zero ao avançado, com muita prática!',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg'
    };

    const testUser = await db.query('INSERT INTO users (name, email, password, "createdAt", "updatedAt", type) values ($1, $2, $3, $4, $5, $6) RETURNING *', [
      user.name, user.email, user.password, Sequelize.NOW, Sequelize.NOW, 'CLIENT'
    ]);

    const token = jwt.sign({ id: testUser.rows[0].id }, process.env.SECRET, {
      expiresIn: 86400,
    });

    const testCourse = await db.query('INSERT INTO courses (name, description, image, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [
      course.name, course.description, course.image, Sequelize.NOW, Sequelize.NOW
    ]);

    const response = await agent.post(`/clients/courses/${testCourse.rows[0].id}`).set({"X-Access-Token": token});
    expect(response.status).toBe(200);
  });
});

describe('GET /clients/courses/started', () => {
  it('should return all started courses by the specified user', async () => {
    const user = {
      name: 'Teste Iniciar',
      email: 'teste@iniciar.com',
      password: 'senha_super_secreta_de_teste',
    };

    const courseOne = {
      name: 'Vue.js do zero!',
      description: 'Aprenda Vue.js do zero ao avançado, com muita prática!',
      image: 'https://i.ytimg.com/vi/Wy9q22isx3U/maxresdefault.jpg'
    };

    const courseTwo = {
      name: 'Angular do zero!',
      description: 'Aprenda Angular do zero ao avançado, com muita prática!',
      image: 'https://blog.trainning.com.br/wp-content/uploads/2018/06/Why-AngularJS-A1.jpg'
    };

    const testUser = await db.query('INSERT INTO users (name, email, password, "createdAt", "updatedAt", type) values ($1, $2, $3, $4, $5, $6) RETURNING *', [
      user.name, user.email, user.password, Sequelize.NOW, Sequelize.NOW, 'CLIENT'
    ]);

    const token = jwt.sign({ id: testUser.rows[0].id }, process.env.SECRET, {
      expiresIn: 86400,
    });

    const testCourseOne = await db.query('INSERT INTO courses (name, description, image, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [
      courseOne.name, courseOne.description, courseOne.image, Sequelize.NOW, Sequelize.NOW
    ]);

    const testCourseTwo = await db.query('INSERT INTO courses (name, description, image, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [
      courseTwo.name, courseTwo.description, courseTwo.image, Sequelize.NOW, Sequelize.NOW
    ]);

    await db.query('INSERT INTO "courseUsers" ("courseId", "userId", "createdAt", "updatedAt", "lastAccessed") values ($1, $2, $3, $4, $5)', [
      testCourseOne.rows[0].id, testUser.rows[0].id, Sequelize.NOW, Sequelize.NOW, Sequelize.NOW
    ]);

    await db.query('INSERT INTO "courseUsers" ("courseId", "userId", "createdAt", "updatedAt", "lastAccessed") values ($1, $2, $3, $4, $5)', [
      testCourseTwo.rows[0].id, testUser.rows[0].id, Sequelize.NOW, Sequelize.NOW, Sequelize.NOW
    ]);

    const result = await agent.get('/clients/courses/started').set({"X-Access-Token": token});
    
    expect(result.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: courseOne.name,
          deleted: false,
          image: courseOne.image,
          description: courseOne.description,
        }),
        expect.objectContaining({
          name: courseTwo.name,
          deleted: false,
          image: courseTwo.image,
          description: courseTwo.description,
        })
      ])
    );

    console.log('It got until here! (This is the end of the first test)');
  });

  it('should return status 404 when no course has been started', async () => {
    const user = {
      name: 'Teste NãoIniciado',
      email: 'teste@naoiniciado.com',
      password: 'senha_super_secreta_de_teste',
    };

    const courseOne = {
      name: 'Vue.js do zero!',
      description: 'Aprenda Vue.js do zero ao avançado, com muita prática!',
      image: 'https://i.ytimg.com/vi/Wy9q22isx3U/maxresdefault.jpg'
    };

    const courseTwo = {
      name: 'Angular do zero!',
      description: 'Aprenda Angular do zero ao avançado, com muita prática!',
      image: 'https://blog.trainning.com.br/wp-content/uploads/2018/06/Why-AngularJS-A1.jpg'
    };

    const testUser = await db.query('INSERT INTO users (name, email, password, "createdAt", "updatedAt", type) values ($1, $2, $3, $4, $5, $6) RETURNING *', [
      user.name, user.email, user.password, Sequelize.NOW, Sequelize.NOW, 'CLIENT'
    ]);

    const token = jwt.sign({ id: testUser.rows[0].id }, process.env.SECRET, {
      expiresIn: 86400,
    });

    await db.query('INSERT INTO courses (name, description, image, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [
      courseOne.name, courseOne.description, courseOne.image, Sequelize.NOW, Sequelize.NOW
    ]);

    await db.query('INSERT INTO courses (name, description, image, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [
      courseTwo.name, courseTwo.description, courseTwo.image, Sequelize.NOW, Sequelize.NOW
    ]);

    const response = await agent.get('/clients/courses/started').set({"X-Access-Token": token});

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Nenhum curso iniciado.');

    console.log('It got until here! (This is the end of the second test)');
  });
});

describe('GET /clients/courses/last-accessed', () => {
  it('should return the last accessed course by the specified user', async () => {
    const user = {
      name: 'Teste Iniciar',
      email: 'teste@iniciar.com',
      password: 'senha_super_secreta_de_teste',
    };

    const courseOne = {
      name: 'Vue.js do zero!',
      description: 'Aprenda Vue.js do zero ao avançado, com muita prática!',
      image: 'https://i.ytimg.com/vi/Wy9q22isx3U/maxresdefault.jpg'
    };

    const courseTwo = {
      name: 'Angular do zero!',
      description: 'Aprenda Angular do zero ao avançado, com muita prática!',
      image: 'https://blog.trainning.com.br/wp-content/uploads/2018/06/Why-AngularJS-A1.jpg'
    };

    const testUser = await db.query('INSERT INTO users (name, email, password, "createdAt", "updatedAt", type) values ($1, $2, $3, $4, $5, $6) RETURNING *', [
      user.name, user.email, user.password, Sequelize.NOW, Sequelize.NOW, 'CLIENT'
    ]);

    const token = jwt.sign({ id: testUser.rows[0].id }, process.env.SECRET, {
      expiresIn: 86400,
    });

    const testCourseOne = await db.query('INSERT INTO courses (name, description, image, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [
      courseOne.name, courseOne.description, courseOne.image, Sequelize.NOW, Sequelize.NOW
    ]);

    const testCourseTwo = await db.query('INSERT INTO courses (name, description, image, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [
      courseTwo.name, courseTwo.description, courseTwo.image, Sequelize.NOW, Sequelize.NOW
    ]);

    await db.query('INSERT INTO "courseUsers" ("courseId", "userId", "createdAt", "updatedAt", "lastAccessed") values ($1, $2, $3, $4, $5)', [
      testCourseOne.rows[0].id, testUser.rows[0].id, Sequelize.NOW, Sequelize.NOW, Sequelize.NOW
    ]);

    await db.query('INSERT INTO "courseUsers" ("courseId", "userId", "createdAt", "updatedAt", "lastAccessed") values ($1, $2, $3, $4, $5)', [
      testCourseTwo.rows[0].id, testUser.rows[0].id, Sequelize.NOW, Sequelize.NOW, Sequelize.NOW
    ]);

    const result = await agent.get('/clients/courses/last-accessed').set({"X-Access-Token": token});
    
    expect(result.body).toMatchObject(
      expect.objectContaining({
        name: courseTwo.name,
        deleted: false,
        image: courseTwo.image,
        description: courseTwo.description,
      })
    );

    console.log('It got until here! (This is the end of the third test)');
  });

  it('should return status 404 when no course has been started', async () => {
    const user = {
      name: 'Teste NãoIniciado',
      email: 'teste@naoiniciado.com',
      password: 'senha_super_secreta_de_teste',
    };

    const courseOne = {
      name: 'Vue.js do zero!',
      description: 'Aprenda Vue.js do zero ao avançado, com muita prática!',
      image: 'https://i.ytimg.com/vi/Wy9q22isx3U/maxresdefault.jpg'
    };

    const courseTwo = {
      name: 'Angular do zero!',
      description: 'Aprenda Angular do zero ao avançado, com muita prática!',
      image: 'https://blog.trainning.com.br/wp-content/uploads/2018/06/Why-AngularJS-A1.jpg'
    };

    const testUser = await db.query('INSERT INTO users (name, email, password, "createdAt", "updatedAt", type) values ($1, $2, $3, $4, $5, $6) RETURNING *', [
      user.name, user.email, user.password, Sequelize.NOW, Sequelize.NOW, 'CLIENT'
    ]);

    const token = jwt.sign({ id: testUser.rows[0].id }, process.env.SECRET, {
      expiresIn: 86400,
    });

    await db.query('INSERT INTO courses (name, description, image, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [
      courseOne.name, courseOne.description, courseOne.image, Sequelize.NOW, Sequelize.NOW
    ]);

    await db.query('INSERT INTO courses (name, description, image, "createdAt", "updatedAt") values ($1, $2, $3, $4, $5) RETURNING *', [
      courseTwo.name, courseTwo.description, courseTwo.image, Sequelize.NOW, Sequelize.NOW
    ]);

    const response = await agent.get('/clients/courses/last-accessed').set({"X-Access-Token": token});

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Nenhum curso iniciado.');

    console.log('It got until here! (This is the end of the fourth test)');
  });
});