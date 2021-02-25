/* global jest, describe, it, expect */
const topicsController = require('../../src/controllers/topicsController');
const InexistingId = require('../../src/errors/InexistingId');
const Chapter = require('../../src/models/Chapter');
const Theory = require('../../src/models/Theory');
const Topic = require('../../src/models/Topic');

jest.mock('../../src/models/Topic');
jest.mock('../../src/models/Chapter');
jest.mock('../../src/models/Theory');
jest.mock('sequelize');

describe('createTopic', () => {
  it('should return a topic with id', async () => {
    const name = 'Introduction';
    const chapterId = 1;
    const youtubeLink = 'https://www.youtube.com/watch?v=efWrIyjmCXg';
    const expectedObject = {
      id: 1,
      name,
      chapterId,
      theory: {
        id: 1,
        youtubeLink,
      },
    };
    Chapter.findByPk.mockResolvedValue(true);
    Topic.create.mockResolvedValue({ id: 1, name, chapterId });
    Theory.create.mockResolvedValue({ id: 1, youtubeLink });
    Topic.findOne.mockResolvedValue(expectedObject);
    const topic = await topicsController.createTopic({ name, chapterId, youtubeLink });
    expect(topic).toBe(expectedObject);
    expect(Topic.create).toHaveBeenCalledWith({ chapterId, name });
    expect(Theory.create).toHaveBeenCalledWith({ topicId: 1, youtubeLink });
  });

  it('should throw an error', async () => {
    const id = -1;
    Chapter.findByPk.mockResolvedValue(null);

    expect(async () => {
      await topicsController.createTopic(id);
    }).rejects.toThrow(InexistingId);
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
    const oldTheoryMocked = {
      id: 1,
      youtubeLink: 'https://www.youtube.com/watch?v=efWrIyjmCXg',
      save: () => {},
    };
    const newTopicData = {
      name: oldTopicMocked.name,
      chapterId: 2,
      theory: {
        id: 1,
      },
    };
    const expectedObject = {
      name: oldTopicMocked.name,
      chapterId: newTopicData.chapterId,
      theory: {
        id: oldTheoryMocked.id,
        youtubeLink: oldTheoryMocked.youtubeLink,
      },
    };
    Topic.findByPk.mockResolvedValue(oldTopicMocked);
    Theory.findByPk.mockResolvedValue(oldTheoryMocked);
    Topic.findOne.mockResolvedValue(expectedObject);
    const topic = await topicsController.editTopic(id, newTopicData);
    expect(topic).toEqual(
      expect.objectContaining(expectedObject),
    );
  });

  it('should throw an error', async () => {
    const id = -1;
    const newTopicData = {
      name: 'Test',
      chapterId: 2,
      theory: {
        id: 1,
      },
    };
    Topic.findByPk.mockResolvedValue(null);

    expect(async () => {
      await topicsController.editTopic(id, newTopicData);
    }).rejects.toThrow(InexistingId);
  });
});

describe('deleteOneTopic', () => {
  it('should return an object', async () => {
    const id = 1;
    Topic.findByPk.mockResolvedValue(true);
    await topicsController.deleteOneTopic(id);
    expect(Topic.destroy).toHaveBeenCalledWith({ where: { id } });
    expect(Theory.destroy).toHaveBeenCalledWith({ where: { topicId: id } });
  });

  it('should throw an error', async () => {
    const id = -1;
    Topic.findByPk.mockResolvedValue(null);

    expect(async () => {
      await topicsController.deleteOneTopic(id);
    }).rejects.toThrow(InexistingId);
  });
});
