/* global jest, describe, it, expect */
const chaptersController = require('../../src/controllers/chaptersController');
const InexistingId = require('../../src/errors/InexistingId');
const Chapter = require('../../src/models/Chapter');

jest.mock('../../src/models/Topic');
jest.mock('sequelize');


describe('createChapter', () => {
  it('should return a chapter with id', async () => {
    const name = 'Introduction';
    const courseId = 1;
    const expectedObject = { id: 1, name, courseId };
    Chapter.create.mockResolvedValue(expectedObject);
    const chapter = await chaptersController.createChapter({ name, courseId });
    expect(chapter).toBe(expectedObject);
  });
});

describe('createListOfChapters', () => {
  it('should an array with the the id included', async () => {
    const chapters = [
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
    Chapter.bulkCreate.mockResolvedValue({});
    jest.spyOn(chaptersController, 'addAllTopicsOfOneCourse').mockImplementationOnce(() => null);
    const resultArray = await chaptersController.createListOfChapters(chapters, courseId);
    expect(resultArray).toEqual(expectedArray);
  });
});

describe('getAllChapters', () => {
  it('should return an array', async () => {
    const expectedArray = [{ id: 1, name: 'Introduction', courseId: 1 }];
    Chapter.findAll.mockResolvedValue(expectedArray);
    const chapters = await chaptersController.getAllChapters();
    expect(chapters).toBe(expectedArray);
  });
});

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
      await chaptersController.getChapterById(id);
    }).rejects.toThrow(InexistingId);
  });
});

describe('getChapterByIdAsAdmin', () => {
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
      await chaptersController.getChapterById(id);
    }).rejects.toThrow(InexistingId);
  });
});