/* global describe, it, expect, beforeEach, afterAll */
const dotenv = require('dotenv');

dotenv.config();
const { Pool } = require('pg');
const { NOW, Sequelize } = require('sequelize');
const supertest = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeEach(async () => {
  await db.query('DELETE FROM topics');
  await db.query('DELETE FROM chapters');
  await db.query('DELETE FROM courses');
});

afterAll(async () => {
  await db.query('DELETE FROM topics');
  await db.query('DELETE FROM chapters');
  await db.query('DELETE FROM courses');
  await sequelize.close();
  await db.end();
});

describe('POST /admin/courses', () => {
  it('should return 201 when passed valid parameters', async () => {
    const body = {
      'name': 'JavaScripter',
      'image': 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      'description': 'JavaScript do Zero',
      'chapters': [
          {
              'name': 'Apresentação AAAAA',
              'topics': [
                  {
                      'name': 'Introdução a prorgramação'
                  },
                  {
                      'name': 'Motivação JavaScript'
                  }
              ]
          },
          {
              'name': 'Apresentação BBBBBB',
              'topics': [
                  {
                      'name': 'Introdução a prorgramação2'
                  },
                  {
                      'name': 'Motivação JavaScript2'
                  }
              ]
          }
      ]
  };
    const response = await agent.post('/admin/courses').send(body);
    expect(response.status).toBe(201);
    expect.objectContaining({
    'name': 'JavaScripter',
    'deleted': false,
    'image': 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
    'description': 'JavaScript do Zero',
    'createdAt': '2021-02-09T19:55:43.611Z',
    'updatedAt': '2021-02-09T19:55:43.611Z',
    'chapters': [
        {
            'name': 'Apresentação AAAAA',
            'topics': [
                {
                    'name': 'Introdução a prorgramação'
                },
                {
                    'name': 'Motivação JavaScript'
                }
            ]
        },
        {
            'name': 'Apresentação BBBBBB',
            'topics': [
              {
                  'name': 'Introdução a prorgramação2'
              },
              {
                  'name': 'Motivação JavaScript2'
              }
          ]
        }
    ]
    })
  });

  it('should return 422 when passed invalid parameters', async () => {
    const body = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      chapters: [],
    };
    const response = await agent.post('/admin/courses').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 409 when name already exists', async () => {
    const body = {
      name: 'JavaScript2',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      chapters: [
        {
            name: 'Apresentação AAAAA',
            topics: [
                {
                    name: 'Introdução a prorgramação'
                },
            ]
        },
    ]
    };
    await db.query('INSERT INTO courses (name, image, description) values ($1, $2, $3)', [body.name, body.image, body.description]);

    const response = await agent.post('/admin/courses').send(body);

    expect(response.status).toBe(409);
  });
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
              'name': 'Introdução a programação'
          },
      ]

  }
    const resultCourse = await db.query('INSERT INTO courses (name, image, description) values ($1, $2, $3) RETURNING *', [course.name, course.image, course.description]);
    const courseId = resultCourse.rows[0].id;

    const resultChapter = await db.query(`INSERT INTO chapters (name, "courseId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *`, [chapter.name,courseId, Sequelize.NOW, Sequelize.NOW]);
    const chapterId = resultChapter.rows[0].id;

    const resultTopic = await db.query(`INSERT INTO topics (name, "chapterId", "createdAt", "updatedAt") values ($1, $2, $3, $4) RETURNING *`, [chapter.topics[0].name,chapterId, Sequelize.NOW, Sequelize.NOW]);
    const topicId = resultTopic.rows[0].id;

    const response = await agent.get(`/clients/courses/${courseId}`);

    expect(response.status).toBe(200);
    expect.objectContaining({
      'id': courseId,
      'name': course.name,
      'deleted': false,
      'image': course.image,
      'description': course.description,
      'chapters': [
          {
            'id': chapterId,
              'name': chapter.name,
              'topics': [
                  {
                      'id': topicId,
                      'name': chapter.topics.name,
                  },
              ]
          },
      ]
    })
  });
});

