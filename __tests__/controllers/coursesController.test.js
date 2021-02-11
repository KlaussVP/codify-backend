/* global jest, describe, it, expect */
const coursesController = require('../../src/controllers/coursesController');
const chaptersController = require('../../src/controllers/chaptersController');
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
      chapters: [
        {
          'name': 'Apresentação Linguagem',
          'topics': [
              {
                  'name': 'Introdução a programação'
              },
              {
                  'name': 'Motivação JavaScript'
              }
          ]

        },
      ]
    };
    const expectedObject = {
      name: 'JavaScript',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      description: 'JavaScript do Zero',
      chapters: [
        {
            id: 85,
            name: 'Apresentação Linguagem',
            topics: [
                {
                    id: 14,
                    name: 'Introdução a programação',
                },
                {
                    id: 15,
                    name: 'Motivação JavaScript',
                }
            ]
        },
      ]
    };
    jest.spyOn(coursesController, 'findCourseByName').mockImplementationOnce(() => null);
    Course.create.mockResolvedValue({});

    jest.spyOn(chaptersController, 'createListOfChapters').mockImplementationOnce(() => null);
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
  it('should return an array of courses', async () => {
    const expectedArray = [{ id: 1, name: 'JavaScript' }];
    Course.findAll.mockResolvedValue(expectedArray);
    const courses = await coursesController.listAllCourses();
    expect(courses).toBe(expectedArray);
  });
});

describe('listAllCoursesAsAdmin', () => {
  it('should return an array of courses', async () => {
    const coursesArray = [
      {
        id: 1,
        name: "JavaScript",
        deleted: false,
        image: "https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg",
        description: "JavaScript do Zero",
        createdAt: "2021-02-09T21:57:37.042Z",
        updatedAt: "2021-02-09T21:57:37.042Z",
        chapters:  [
          {
          "id": 99,
          },
          {
          "id": 100,
          },
        ],
      },
      {
        id: 2,
        name: "JavaScript2",
        deleted: false,
        image: "https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg",
        description: "JavaScript do Zero2",
        createdAt: "2021-02-09T21:57:37.042Z",
        updatedAt: "2021-02-09T21:57:37.042Z",
        chapters:  [
          {
          "id": 41,
          },
          {
          "id": 100,
          },
        ],
      }
    ];
    const expectedArray = [
      {
        id: 1,
        name: "JavaScript",
        deleted: false,
        image: "https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg",
        description: "JavaScript do Zero",
        createdAt: "2021-02-09T21:57:37.042Z",
        updatedAt: "2021-02-09T21:57:37.042Z",
        chapters:  [ 99,100 ],
      },
      {
        id: 2,
        name: "JavaScript2",
        deleted: false,
        image: "https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg",
        description: "JavaScript do Zero2",
        createdAt: "2021-02-09T21:57:37.042Z",
        updatedAt: "2021-02-09T21:57:37.042Z",
        chapters:  [ 41,100 ],
      }
    ];
    Course.findAll.mockResolvedValue(coursesArray);
    const courses = await coursesController.listAllCoursesAsAdmin();
    expect(courses).toEqual(
      expect.arrayContaining(expectedArray));
  });
});

describe('getCourseById', () => {
  it('should return an object course', async () => {
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

describe('getCourseByIdAsAdmin', () => {
  it('should return an object course', async () => {
    const id = 1;
    const courseObject = {
      id: 1,
      name: "JavaScript",
      deleted: false,
      image: "https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg",
      description: "JavaScript do Zero",
      createdAt: "2021-02-09T21:57:37.042Z",
      updatedAt: "2021-02-09T21:57:37.042Z",
      chapters:  [
        {
        "id": 99,
        },
        {
        "id": 100,
        },
      ],
    };
    const expectedObject = {... courseObject, "chapters": [99,100] } ;
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

