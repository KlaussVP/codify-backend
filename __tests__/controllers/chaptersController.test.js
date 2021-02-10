/* global jest, describe, it, expect */
const chaptersController = require('../../src/controllers/chaptersController');
const InexistingId = require('../../src/errors/InexistingId');
const Chapter = require('../../src/models/Chapter');

jest.mock('../../src/models/Topic');
jest.mock('sequelize');

describe('getChapterById', () => {
  it('should return an object', async () => {
    const id = 1;
    const expectedObject = { id, name: 'Introduction', courseId: 1 };
    Chapter.findOne.mockResolvedValue(expectedObject);
    const chapter = await chaptersController.getChapterById(id);
    expect(chapter).toBe(expectedObject);
  });

  it('should throw an error', async () => {
    const id = -1;
    Chapter.findOne.mockResolvedValue(null);

    expect(async () => {
      await chapterssController.getchaptersById(id);
    }).rejects.toThrow(InexistingId);
  });
});


/* TO BE IMPLEMENTED FOR CHAPTERS
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
*/