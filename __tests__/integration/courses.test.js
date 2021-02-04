/* global describe, it, expect, beforeEach, afterAll */
const dotenv = require('dotenv');

dotenv.config();
const { Pool } = require('pg');
const supertest = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeEach(async () => {
  await db.query('DELETE FROM topics');
  await db.query('DELETE FROM courses');
});

afterAll(async () => {
  await db.query('DELETE FROM topics');
  await db.query('DELETE FROM courses');
  await sequelize.close();
  await db.end();
});

describe('POST /clients/courses', () => {
  it('should return 201 when passed valid parameters', async () => {
    const body = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      topics: [
        {
          name: 'Apresentação',
        },
        {
          name: 'Preparando o ambiente',
        },
      ],
    };
    const response = await agent.post('/admin/courses').send(body);
    expect(response.status).toBe(201);
  });

  it('should return 422 when passed invalid parameters', async () => {
    const body = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      topics: [],
    };
    const response = await agent.post('/admin/courses').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 409 when name already exists', async () => {
    const body = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      topics: [
        {
          name: 'Apresentação',
        },
        {
          name: 'Preparando o ambiente',
        },
      ],
    };
    await db.query('INSERT INTO courses (name, image, description) values ($1, $2, $3)', [body.name, body.image, body.description]);

    const response = await agent.post('/admin/courses').send(body);

    expect(response.status).toBe(409);
  });
});
