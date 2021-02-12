/* global describe, it, expect, beforeEach, afterAll */
const dotenv = require('dotenv');

dotenv.config();
const { Pool } = require('pg');
const supertest = require('supertest');
const app = require('../../src/app');
const verifyJWT = require('../../src/middlewares/authMiddleware');
const sequelize = require('../../src/utils/database');
const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');

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
