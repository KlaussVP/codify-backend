/* global jest, describe, it, expect */
const coursesController = require('../../src/controllers/coursesController');
const topicsController = require('../../src/controllers/topicsController');
const InexistingId = require('../../src/errors/InexistingId');
const ConflictError = require('../../src/errors/ConflictError');
const Course = require('../../src/models/Course');

jest.mock('../../src/models/Course');
jest.mock('sequelize');

describe('create', () => {
  it('should return the expected Object', async () => {
    const CourseData = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    const expectedObject = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      topics: [
        {
          id: 4,
          name: 'Apresentação',
        },
        {
          id: 5,
          name: 'Preparando o ambiente',
        },
      ],
    };
    jest.spyOn(coursesController, 'findCourseByName').mockImplementationOnce(() => null);
    Course.create.mockResolvedValue({});

    jest.spyOn(topicsController, 'createListOfTopics').mockImplementationOnce(() => null);
    jest.spyOn(coursesController, 'getCourseById').mockImplementationOnce(() => expectedObject);

    const course = await coursesController.create(CourseData);

    expect(course).toBe(expectedObject);
  });

  it('should throw an error of Conflict', async () => {
    const CourseData = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
    };
    jest.spyOn(coursesController, 'findCourseByName').mockImplementationOnce(() => true);

    expect(async () => {
      await coursesController.create(CourseData);
    }).rejects.toThrow(ConflictError);
  });
});

describe('findCourseByName', () => {
  it('should return the same object', async () => {
    const name = 'JvaScript';
    const expectedObject = { id: 1, name };
    Course.findOne.mockResolvedValue(expectedObject);
    const course = await coursesController.findCourseByName(name);
    expect(course).toBe(expectedObject);
  });
});

describe('listAllCourses', () => {
  it('should return an array', async () => {
    const expectedArray = [{ id: 1, name: 'JavaScript' }];
    Course.findAll.mockResolvedValue(expectedArray);
    const courses = await coursesController.listAllCourses();
    expect(courses).toBe(expectedArray);
  });
});

describe('getCourseById', () => {
  it('should return an object', async () => {
    const id = 1;
    const expectedObject = { id, name: 'JavaScript' };
    Course.findOne.mockResolvedValue(expectedObject);
    const course = await coursesController.getCourseById(id);
    expect(course).toBe(expectedObject);
  });

  it('should throw an error', async () => {
    const id = -1;
    Course.findOne.mockResolvedValue(null);

    expect(async () => {
      await coursesController.getCourseById(id);
    }).rejects.toThrow(InexistingId);
  });
});
