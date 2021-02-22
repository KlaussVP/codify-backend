/* global jest, describe, it, expect */
const topicsController = require('../../src/controllers/topicsController');
const InexistingId = require('../../src/errors/InexistingId');
const Topic = require('../../src/models/Topic');

jest.mock('../../src/models/Topic');
jest.mock('sequelize');

describe('createTopic', () => {
  it('should return a topic with id', async () => {
    const name = 'Introduction';
    const chapterId = 1;
    const expectedObject = { id: 1, name, chapterId };
    Topic.create.mockResolvedValue(expectedObject);
    const topic = await topicsController.createTopic({ name, chapterId });
    expect(topic).toBe(expectedObject);
    expect(Topic.create).toHaveBeenCalledWith({ chapterId, name });
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
    const chapterId = 1;
    const expectedArray = [
      {
        name: 'Apresentação',
        chapterId,
      },
      {
        name: 'Preparando o ambiente',
        chapterId,
      },
    ];
    Topic.bulkCreate.mockResolvedValue({});
    const resultArray = await topicsController.createListOfTopics(topics, chapterId);
    expect(resultArray).toEqual(
      expect.objectContaining(expectedArray),
    );
  });
});

describe('getAllTopics', () => {
  it('should return an array', async () => {
    const expectedArray = [{ id: 1, name: 'Introduction', chapterId: 1 }];
    Topic.findAll.mockResolvedValue(expectedArray);
    const topics = await topicsController.getAllTopics();
    expect(topics.length).toBe(1);
    expect(topics).toBe(expectedArray);
  });
});

describe('getTopicByIdAsAdmin', () => {
  it('should return an object', async () => {
    const id = 1;
    const expectedObject = { id, name: 'Introduction', chapterId: 1 };
    Topic.findByPk.mockResolvedValue(expectedObject);
    const topic = await topicsController.getTopicByIdAsAdmin(id);
    expect(topic).toBe(expectedObject);
  });

  it('should throw an error', async () => {
    const id = -1;
    Topic.findByPk.mockResolvedValue(null);

    expect(async () => {
      await topicsController.getTopicByIdAsAdmin(id);
    }).rejects.toThrow(InexistingId);
  });
});

describe('editTopic', () => {
  it('should return an object', async () => {
    const id = 1;
    const oldTopicMocked = {
      name: 'Introduction',
      chapterId: 1,
      save: () => {},
    };
    const newTopicData = { chapterId: 2 };
    const expectedObject = { name: oldTopicMocked.name, chapterId: newTopicData.chapterId };
    Topic.findByPk.mockResolvedValue(oldTopicMocked);
    const topic = await topicsController.editTopic(id, newTopicData);
    expect(topic).toEqual(
      expect.objectContaining(expectedObject),
    );
  });

  it('should throw an error', async () => {
    const id = -1;
    Topic.findByPk.mockResolvedValue(null);

    expect(async () => {
      await topicsController.editTopic(id);
    }).rejects.toThrow(InexistingId);
  });
});
