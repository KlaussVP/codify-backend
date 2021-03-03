/* global jest, describe, it, expect */
const coursesController = require('../../src/controllers/coursesController');
const InexistingId = require('../../src/errors/InexistingId');
const ConflictError = require('../../src/errors/ConflictError');
const Course = require('../../src/models/Course');
const Theory = require('../../src/models/Theory');
const Exercise = require('../../src/models/Exercise');
const Chapter = require('../../src/models/Chapter');
const Topic = require('../../src/models/Topic');
const TheoryUser = require('../../src/models/TheoryUser');
const ExerciseUser = require('../../src/models/ExerciseUser');
const CourseUser = require('../../src/models/CourseUser');

jest.mock('../../src/models/Course');
jest.mock('../../src/models/Theory');
jest.mock('../../src/models/Exercise');
jest.mock('../../src/models/Chapter');
jest.mock('../../src/models/Topic');
jest.mock('../../src/models/TheoryUser');
jest.mock('../../src/models/ExerciseUser');
jest.mock('../../src/models/CourseUser');

jest.mock('sequelize');

describe('createAsAdmin', () => {
  it('should return the expected Object', async () => {
    const CourseData = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    jest.spyOn(coursesController, 'findCourseByName').mockImplementationOnce(() => null);
    Course.create.mockResolvedValue(CourseData);

    const course = await coursesController.createAsAdmin(CourseData);

    expect(course).toBe(CourseData);
  });

  it('should throw an error of Conflict', async () => {
    const CourseData = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    jest.spyOn(coursesController, 'findCourseByName').mockImplementationOnce(() => true);

    expect(async () => {
      await coursesController.createAsAdmin(CourseData);
    }).rejects.toThrow(ConflictError);
  });
});

describe('findCourseByName', () => {
  it('should return the same object', async () => {
    const name = 'JavaScript';
    const expectedObject = { id: 1, name };
    Course.findOne.mockResolvedValue(expectedObject);
    const course = await coursesController.findCourseByName(name);
    expect(course).toBe(expectedObject);
  });
});

describe('editAsAdmin', () => {
  it('should return the expected Object with the new changes', async () => {
    const CourseCurrentData = {
      id: 1,
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      save: () => {},
    };
    const CourseNewData = {
      id: 1,
      name: 'JavaScript222',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero EDITADO',
      save: () => {},
    };
    jest.spyOn(coursesController, 'getCourseById').mockImplementationOnce(() => CourseCurrentData);
    jest.spyOn(coursesController, 'findCourseByName').mockImplementationOnce(() => null);

    const course = await coursesController.editAsAdmin(CourseNewData);

    expect(course).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'JavaScript222',
        image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
        description: 'JavaScript do Zero EDITADO',
      }),
    );
  });

  it('should return the expected Object with the new changes', async () => {
    const CourseCurrentData = {
      id: 1,
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      save: () => {},
    };
    const CourseNewData = {
      id: 1,
      name: 'JavaScript EDITADO',
    };
    jest.spyOn(coursesController, 'getCourseById').mockImplementationOnce(() => CourseCurrentData);
    jest.spyOn(coursesController, 'findCourseByName').mockImplementationOnce(() => null);

    const course = await coursesController.editAsAdmin(CourseNewData);

    expect(course).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'JavaScript EDITADO',
        image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
        description: 'JavaScript do Zero',
      }),
    );
  });

  it('should throw an error of InexistingId', async () => {
    const CourseData = {
      id: -1,
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    jest.spyOn(coursesController, 'getCourseById').mockImplementationOnce(() => null);

    expect(async () => {
      await coursesController.editAsAdmin(CourseData);
    }).rejects.toThrow(InexistingId);
  });

  it('should throw an error of Conflict', async () => {
    const CourseData = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    jest.spyOn(coursesController, 'getCourseById').mockImplementationOnce(() => CourseData);
    jest.spyOn(coursesController, 'findCourseByName').mockImplementationOnce(() => true);

    expect(async () => {
      await coursesController.editAsAdmin(CourseData);
    }).rejects.toThrow(ConflictError);
  });
});

describe('listAllCourses', () => {
  it('should return an array of courses', async () => {
    const expectedArray = [
      { id: 1, name: 'JavaScript', deleted: false },
      { id: 2, name: 'JavaScript2', deleted: true },
    ];
    Course.findAll.mockResolvedValue(expectedArray);
    const courses = await coursesController.listAllCourses();
    expect(courses.length).toBe(1);
    expect(courses).toEqual(
      expect.arrayContaining([
        { id: 1, name: 'JavaScript', deleted: false },
      ]),
    );
  });
});

describe('listAllCoursesAsAdmin', () => {
  it('should return an array of courses', async () => {
    const coursesArray = [
      {
        id: 1,
        name: 'JavaScript',
        deleted: false,
        image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
        description: 'JavaScript do Zero',
        createdAt: '2021-02-09T21:57:37.042Z',
        updatedAt: '2021-02-09T21:57:37.042Z',
        chapters: [
          {
            id: 99,
          },
          {
            id: 100,
          },
        ],
      },
      {
        id: 2,
        name: 'JavaScript2',
        deleted: false,
        image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
        description: 'JavaScript do Zero2',
        createdAt: '2021-02-09T21:57:37.042Z',
        updatedAt: '2021-02-09T21:57:37.042Z',
        chapters: [
          {
            id: 41,
          },
          {
            id: 100,
          },
        ],
      },
    ];
    const expectedArray = [
      {
        id: 1,
        name: 'JavaScript',
        deleted: 'false',
        image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
        description: 'JavaScript do Zero',
        createdAt: '2021-02-09T21:57:37.042Z',
        updatedAt: '2021-02-09T21:57:37.042Z',
        chapters: [99, 100],
      },
      {
        id: 2,
        name: 'JavaScript2',
        deleted: 'false',
        image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
        description: 'JavaScript do Zero2',
        createdAt: '2021-02-09T21:57:37.042Z',
        updatedAt: '2021-02-09T21:57:37.042Z',
        chapters: [41, 100],
      },
    ];
    Course.findAll.mockResolvedValue(coursesArray);
    const courses = await coursesController.listAllCoursesAsAdmin();
    expect(courses).toEqual(expectedArray);
  });
  it('should return an array of courses eliminating the deleted ones', async () => {
    const coursesArray = [
      {
        id: 1,
        name: 'JavaScript',
        deleted: false,
        image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
        description: 'JavaScript do Zero',
        createdAt: '2021-02-09T21:57:37.042Z',
        updatedAt: '2021-02-09T21:57:37.042Z',
        chapters: [
          {
            id: 99,
          },
          {
            id: 100,
          },
        ],
      },
      {
        id: 2,
        name: 'JavaScript2',
        deleted: true,
        image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
        description: 'JavaScript do Zero2',
        createdAt: '2021-02-09T21:57:37.042Z',
        updatedAt: '2021-02-09T21:57:37.042Z',
        chapters: [
          {
            id: 41,
          },
          {
            id: 100,
          },
        ],
      },
    ];
    const expectedArray = [
      {
        id: 1,
        name: 'JavaScript',
        deleted: 'false',
        image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
        description: 'JavaScript do Zero',
        createdAt: '2021-02-09T21:57:37.042Z',
        updatedAt: '2021-02-09T21:57:37.042Z',
        chapters: [99, 100],
      },
    ];
    Course.findAll.mockResolvedValue(coursesArray);
    const courses = await coursesController.listAllCoursesAsAdmin();
    expect(courses).toEqual(expectedArray);
  });
});

describe('getCourseWithNumberActivities', () => {
  it('should return an object course', async () => {
    const id = 1;
    const expectedObject = { id, name: 'JavaScript' };
    Course.findOne.mockResolvedValue(expectedObject);
    jest.spyOn(coursesController, 'getCourseProgress').mockImplementationOnce(() => expectedObject);
    const course = await coursesController.getCourseWithNumberActivities(id);
    expect(course).toBe(expectedObject);
  });

  it('should throw an error', async () => {
    const id = -1;
    Course.findOne.mockResolvedValue(null);

    expect(async () => {
      await coursesController.getCourseWithNumberActivities(id);
    }).rejects.toThrow(InexistingId);
  });
});

describe('getCourseByIdComplete', () => {
  it('should return an object course', async () => {
    const id = 1;
    const expectedObject = { id, name: 'JavaScript' };
    Course.findOne.mockResolvedValue(expectedObject);
    const course = await coursesController.getCourseByIdComplete(id);
    expect(course).toBe(expectedObject);
  });

  it('should throw an error', async () => {
    const id = -1;
    Course.findOne.mockResolvedValue(null);

    expect(async () => {
      await coursesController.getCourseByIdComplete(id);
    }).rejects.toThrow(InexistingId);
  });
});

describe('getCourseByIdAsAdmin', () => {
  it('should return an object course', async () => {
    const id = 1;
    const courseObject = {
      id: 1,
      name: 'JavaScript',
      deleted: false,
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      createdAt: '2021-02-09T21:57:37.042Z',
      updatedAt: '2021-02-09T21:57:37.042Z',
      chapters: [
        {
          id: 99,
        },
        {
          id: 100,
        },
      ],
    };
    const expectedObject = { ...courseObject, chapters: [99, 100] };
    Course.findOne.mockResolvedValue(courseObject);
    const course = await coursesController.getCourseByIdAsAdmin(id);
    expect(course).toMatchObject(expectedObject);
  });

  it('should throw an error', async () => {
    const id = -1;
    Course.findOne.mockResolvedValue(null);

    expect(async () => {
      await coursesController.getCourseById(id);
    }).rejects.toThrow(InexistingId);
  });
});

describe('deleteCourse', () => {
  it('should return the object with deleted TRUE', async () => {
    const CourseCurrentData = {
      id: 1,
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      deleted: false,
      save: () => {},
    };
    jest.spyOn(coursesController, 'getCourseById').mockImplementationOnce(() => CourseCurrentData);

    const course = await coursesController.deleteCourse(CourseCurrentData.id);

    expect(course).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'JavaScript',
        image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
        description: 'JavaScript do Zero',
        deleted: true,
      }),
    );
  });

  it('should throw an error of InexistingId', async () => {
    const CourseData = {
      id: -1,
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      deleted: false,
    };
    jest.spyOn(coursesController, 'getCourseById').mockImplementationOnce(() => null);

    expect(async () => {
      await coursesController.deleteCourse(CourseData);
    }).rejects.toThrow(InexistingId);
  });
});

describe('getCourseProgress', () => {
  it('should return a course with number of theories and exercises', async () => {
    const course = {
      id: 1,
      name: 'JavaScript',
      description: 'Test',
      chapters: [
        {
          id: 1,
          name: 'Introduction',
          topics: [
            {
              id: 1,
              name: 'First step',
              theory: {
                id: 6,
              },
            },
            {
              id: 2,
              name: 'Second step',
              theory: {
                id: 7,
              },
            },
          ],
        },
      ],
    };
    const expectedObject = {
      id: 1,
      name: 'JavaScript',
      description: 'Test',
      started: false,
      chapters: [
        {
          exerciseCount: 4,
          id: 1,
          name: 'Introduction',
          theoryCount: 2,
          topics: [
            {
              id: 1,
              name: 'First step',
              done: false,
              theoryId: 6,
            },
            {
              id: 2,
              name: 'Second step',
              done: false,
              theoryId: 7,
            },
          ],
        },
      ],
    };
    Theory.findAll.mockResolvedValue(['Th1']);
    Exercise.findAll.mockResolvedValue(['Ex1', 'Ex2']);
    CourseUser.findAll.mockResolvedValue([]);
    TheoryUser.count(1);
    ExerciseUser.count(1);
    const result = await coursesController.getCourseProgress(course, 1);
    expect(result).toMatchObject(expectedObject);
  });
});

describe('getIdsToStartACourse', () => {
  it('should return an object with courseId, chapterId, topicId and theoryId', async () => {
    const id = 1;

    const expectedObject = {
      courseId: id,
      chapterId: 2,
      topicId: 3,
      theoryId: 4,
    };

    Chapter.findOne.mockResolvedValue({ id: expectedObject.chapterId });
    Topic.findOne.mockResolvedValue({ id: expectedObject.topicId });
    Theory.findOne.mockResolvedValue({ id: expectedObject.theoryId });

    const result = await coursesController.getIdsToStartACourse(id);

    expect(result).toMatchObject(expectedObject);
  });

  it('should throw an error', async () => {
    const id = 1;

    Chapter.findOne.mockResolvedValue(null);

    expect(async () => {
      await coursesController.getIdsToStartACourse(id);
    }).rejects.toThrow(InexistingId);
  });
});
