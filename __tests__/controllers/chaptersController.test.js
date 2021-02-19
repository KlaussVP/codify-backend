/* global jest, describe, it, expect */
const { Sequelize } = require('sequelize');
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
  it('should return an array with the id included', async () => {
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
  it('should return an array of chapters', async () => {
    const expectedArray = [{ id: 1, name: 'Introduction', courseId: 1 }];
    Chapter.findAll.mockResolvedValue(expectedArray);
    const chapters = await chaptersController.getAllChapters();
    expect(chapters).toBe(expectedArray);
  });
});

describe('getChapterById', () => {
  it('should return an object chapter', async () => {
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
  it('should return an object chapters', async () => {
    const id = 1;
    const chapterObject = {
      id,
      name: 'Preparando o ambiente',
      courseId: 2,
      createdAt: Sequelize.NOW,
      updatedAt: Sequelize.NOW,
      topics: [
        {
          id: 6,
        },
        {
          id: 14,
        },
      ],
    };
    const expectedObject = { ...chapterObject, topics: [6, 14] };

    Chapter.findOne.mockResolvedValue(chapterObject);
    const chapter = await chaptersController.getChapterByIdAsAdmin(id);
    expect(chapter).toMatchObject(expectedObject);
  });

  it('should throw an error', async () => {
    const id = -1;
    Chapter.findOne.mockResolvedValue(null);

    expect(async () => {
      await chaptersController.getChapterById(id);
    }).rejects.toThrow(InexistingId);
  });
});
