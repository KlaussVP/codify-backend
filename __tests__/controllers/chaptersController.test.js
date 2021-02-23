/* global jest, describe, it, expect */
const { Sequelize } = require('sequelize');
const chaptersController = require('../../src/controllers/chaptersController');
const InexistingId = require('../../src/errors/InexistingId');
const Chapter = require('../../src/models/Chapter');
const Course = require('../../src/models/Course');

jest.mock('../../src/models/Topic');
jest.mock('../../src/controllers/topicsController');
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

describe('editChapter', () => {
  it('should return a chapter with the updated information', async () => {
    const id = 1;
    const courseId = 1;
    const currentChapter = { id, name: 'Apresentação', courseId, save: () => {} };
    const update = { name: 'Introdução a JS' };
    const expectedChapter = { id, name: update.name, courseId }

    Chapter.findByPk.mockResolvedValue(currentChapter);

    const updatedChapter = await chaptersController.editChapter(id, update);

    expect(updatedChapter).toMatchObject(expectedChapter);
  });

  it('should throw an error', async () => {
    const id = -1;
    const update = { name: 'Introdução a JS', courseId: 2 };
    Chapter.findByPk.mockResolvedValue(null);

    expect(async () => {
      await chaptersController.editChapter(id, update);
    }).rejects.toThrow(InexistingId);
  });
});

describe('deleteOneChapter', () => {
  it('should delete the passed chapter along with all its topics', async () => {
    const chapterId = 1;
    Chapter.findByPk.mockResolvedValue(true);

    await chaptersController.deleteOneChapter(chapterId);

    expect(Chapter.destroy).toHaveBeenCalledWith({ 
      where: { id: chapterId },
      cascade: true
    });
  });

  it('should throw an error', async () => {
    const id = -1;
    Chapter.findByPk.mockResolvedValue(null);

    expect(async () => {
      await chaptersController.deleteOneChapter(id);
    }).rejects.toThrow(InexistingId);
  });
});

describe('deleteChaptersFromCourse', () => {
  it('should delete all chapters along with all its topics from the passed course', async () => {
    const courseId = 164;
    jest.spyOn(chaptersController, 'getChaptersByCourse').mockResolvedValueOnce([{
      id: 74,
      name: "Apresentação",
      courseId,
      createdAt: "2021-02-19T18:46:18.844Z",
      updatedAt: "2021-02-19T18:46:18.844Z"
    },
    {
      id: 75,
      name: "Preparando o ambiente",
      courseId,
      createdAt: "2021-02-19T18:46:18.844Z",
      updatedAt: "2021-02-19T18:46:18.844Z"
    },
    {
      id: 76,
      name: "Introdução à linguagem JS",
      courseId,
      createdAt: "2021-02-19T18:46:18.844Z",
      updatedAt: "2021-02-19T18:46:18.844Z"
    },
    {
      id: 77,
      name: "Variáveis e Tipos de Dados",
      courseId,
      createdAt: "2021-02-19T18:46:18.844Z",
      updatedAt: "2021-02-19T18:46:18.844Z"
    }]);

    Course.findByPk.mockResolvedValue(true);

    await chaptersController.deleteChaptersFromCourse(courseId);

    expect(Chapter.destroy).toHaveBeenCalledWith({ 
      where: { courseId },
      cascade: true 
    });
  });

  it('should throw an error', async () => {
    const id = -1;
    Course.findByPk.mockResolvedValue(null);

    expect(async () => {
      await chaptersController.deleteChaptersFromCourse(id);
    }).rejects.toThrow(InexistingId);
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

describe('getAllChaptersAsAdmin', () => {
  it('should return an array of chapters with its topics in an array with only the topics id numbers', async () => {
    const recievedArray = [{
      id: 90,
      name: "Classes em JS",
      courseId: 164,
      createdAt: "2021-02-23T14:48:54.846Z",
      updatedAt: "2021-02-23T14:48:54.846Z",
      topics: [
        { id: 105 },
        { id: 106 },
        { id: 107 },
        { id: 108 },
        { id: 109 }
      ]
    }];
    const expectedArray = [{
      id: 90,
      name: "Classes em JS",
      courseId: 164,
      createdAt: "2021-02-23T14:48:54.846Z",
      updatedAt: "2021-02-23T14:48:54.846Z",
      topics: [
        105,
        106,
        107,
        108,
        109
      ]
    }];

    Chapter.findAll.mockResolvedValue(recievedArray);
    
    const chapters = await chaptersController.getAllChaptersAsAdmin();
    expect(chapters).toStrictEqual(expectedArray);
  });
});

describe('getChaptersByCourse', () => {
  it('should return an array with all chapters from the passed courseId', async () => {
    const courseId = 164;
    const expectedArrayOfChapters = [{
      id: 74,
      name: "Apresentação",
      courseId,
      createdAt: "2021-02-19T18:46:18.844Z",
      updatedAt: "2021-02-19T18:46:18.844Z"
    },
    {
      id: 75,
      name: "Preparando o ambiente",
      courseId,
      createdAt: "2021-02-19T18:46:18.844Z",
      updatedAt: "2021-02-19T18:46:18.844Z"
    },
    {
      id: 76,
      name: "Introdução à linguagem JS",
      courseId,
      createdAt: "2021-02-19T18:46:18.844Z",
      updatedAt: "2021-02-19T18:46:18.844Z"
    },
    {
      id: 77,
      name: "Variáveis e Tipos de Dados",
      courseId,
      createdAt: "2021-02-19T18:46:18.844Z",
      updatedAt: "2021-02-19T18:46:18.844Z"
    }];

    Course.findByPk.mockResolvedValue(true);
    Chapter.findAll.mockResolvedValue(expectedArrayOfChapters);

    const chapters = await chaptersController.getChaptersByCourse(courseId);
    expect(chapters).toStrictEqual(expectedArrayOfChapters); 
  });

  it('should throw an error', async () => {
    const id = -1;
    Course.findByPk.mockResolvedValue(null);

    expect(async () => {
      await chaptersController.getChaptersByCourse(id);
    }).rejects.toThrow(InexistingId);
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
