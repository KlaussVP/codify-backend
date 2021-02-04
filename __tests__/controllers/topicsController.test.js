/* global jest, describe, it, expect */
const topicsController = require('../../src/controllers/topicsController');
const InexistingId = require('../../src/errors/InexistingId');
const Topic = require('../../src/models/Topic');

jest.mock('../../src/models/Topic');
jest.mock('sequelize');

describe('createTopic', () => {
  it('should return a topic with id', async () => {
    const name = 'Introduction';
    const courseId = 1;
    const expectedObject = { id: 1, name, courseId };
    Topic.create.mockResolvedValue(expectedObject);
    const topic = await topicsController.createTopic({ name, courseId });
    expect(topic).toBe(expectedObject);
  });
});

describe('createListOfTopics', () => {
  it('should an array with the the id included', async () => {
    const topics = [
      {
        name: 'Apresentação',
      },
      {
        name: 'Preparando o ambiente',
      },
    ];
    const courseId = 1;
    const expectedArray = [
      {
        name: 'Apresentação',
        courseId,
      },
      {
        name: 'Preparando o ambiente',
        courseId,
      },
    ];
    Topic.bulkCreate.mockResolvedValue({});
    const resultArray = await topicsController.createListOfTopics(topics, courseId);
    expect(resultArray).toEqual(expectedArray);
  });
});

describe('getAllTopics', () => {
  it('should return an array', async () => {
    const expectedArray = [{ id: 1, name: 'Introduction', userId: 1 }];
    Topic.findAll.mockResolvedValue(expectedArray);
    const topics = await topicsController.getAllTopics();
    expect(topics).toBe(expectedArray);
  });
});

describe('getTopicById', () => {
  it('should return an object', async () => {
    const id = 1;
    const expectedObject = { id, name: 'Introduction', userId: 1 };
    Topic.findByPk.mockResolvedValue(expectedObject);
    const topic = await topicsController.getTopicById(id);
    expect(topic).toBe(expectedObject);
  });

  it('should throw an error', async () => {
    const id = -1;
    Topic.findByPk.mockResolvedValue(null);

    expect(async () => {
      await topicsController.getTopicById(id);
    }).rejects.toThrow(InexistingId);
  });
});
