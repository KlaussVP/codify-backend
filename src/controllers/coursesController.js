const { Sequelize } = require('sequelize');
const Course = require('../models/Course');
const ConflictError = require('../errors/ConflictError');
const InexistingId = require('../errors/InexistingId');
const NoCourseStarted = require('../errors/NoCourseStarted');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const CourseUser = require('../models/CourseUser');
const Theory = require('../models/Theory');
const Exercise = require('../models/Exercise');

class CoursesController {
  async findCourseByName(name) {
    const course = await Course.findOne({ where: { name } });
    return course;
  }

  async createAsAdmin({
    name, image, description,
  }) {
    const coursesExists = await this.findCourseByName(name);
    if (coursesExists) throw new ConflictError();

    const course = await Course.create({ name, image, description });
    return course;
  }

  async editAsAdmin({
    id, name, image, description,
  }) {
    const course = await this.getCourseById(id);
    if (!course) throw new InexistingId();

    const coursesExists = await this.findCourseByName(name);
    if (coursesExists) throw new ConflictError();

    course.name = name || course.name;
    course.image = image || course.image;
    course.description = description || course.description;

    await course.save();
    return course;
  }

  async deleteCourse(id) {
    const course = await this.getCourseById(id);
    if (!course) throw new InexistingId();

    course.deleted = true;
    await course.save();
    return course;
  }

  async listAllCourses() {
    const courses = await Course.findAll();
    const coursesNotDeleted = courses.filter((c) => c.deleted === false);
    return coursesNotDeleted;
  }

  async listAllCoursesAsAdmin() {
    const courses = await Course.findAll({
      include: [{
        model: Chapter,
        attributes: ['id'],
      }],
    });
    const coursesNotDeleted = courses.filter((c) => c.deleted === false);

    const coursesArrayAdminFormat = [];

    coursesNotDeleted.forEach((course) => {
      const chaptersIds = course.chapters.map((c) => c.id);
      const courseObjectToAdmin = {
        id: course.id,
        name: course.name,
        deleted: JSON.stringify(course.deleted),
        image: course.image,
        description: course.description,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        chapters: chaptersIds,
      };
      coursesArrayAdminFormat.push(courseObjectToAdmin);
    });

    return coursesArrayAdminFormat;
  }

  async getCourseById(id) {
    const course = await Course.findOne({
      where: { id },
      include: [{
        model: Chapter,
        attributes: ['id', 'name'],
        include: {
          model: Topic,
          attributes: ['id', 'name'],
          include: [{
            model: Theory,
            attributes: ['id', 'youtubeLink'],
          }, {
            model: Exercise,
            attributes: ['id', 'title'],
          }],
        },
      }],
      order: [
        [Chapter, 'id', 'ASC'],
        [Chapter, Topic, 'id', 'ASC'],
        [Chapter, Topic, Theory, 'id', 'ASC'],
        [Chapter, Topic, Exercise, 'id', 'ASC'],
      ],
    });
    if (!course) throw new InexistingId();

    return course;
  }

  async getCourseByIdAsClient(id) {
    const course = await Course.findOne({
      where: { id },
      attributes: ['id', 'name', 'description'],
      include: [{
        model: Chapter,
        attributes: ['id', 'name'],
        include: [{
          model: Topic,
          attributes: ['id', 'name'],
        }],
        order: [
          [Chapter, 'id', 'ASC'],
        ],
      }],
    });
    if (!course) throw new InexistingId();

    const courseToSend = await this.getNumberOfActivities(course);

    return courseToSend;
  }

  async startOrContinueCourse(courseId, userId) {
    // eslint-disable-next-line no-unused-vars
    const [startedCourse, created] = await CourseUser.findOrCreate({
      where: {
        courseId,
        userId,
      },
    });

    if (!created) {
      await CourseUser.update({ lastAccessed: new Date() }, {
        where: {
          courseId,
          userId,
        },
      });
    }
  }

  async getCourseByIdAsAdmin(id) {
    const course = await Course.findOne({
      where: { id },
      include: [{
        model: Chapter,
        attributes: ['id', 'name'],
      }],
    });
    if (!course) throw new InexistingId();

    const chaptersIds = course.chapters.map((c) => c.id);

    const courseObjectToAdmin = {
      id: course.id,
      name: course.name,
      deleted: course.deleted,
      image: course.image,
      description: course.description,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      chapters: chaptersIds,
    };
    return courseObjectToAdmin;
  }

  async listStartedCourses(userId) {
    const startedCoursesId = await CourseUser.findAll({
      where: { userId, deleted: false },
      attributes: ['courseId'],
    });

    if (startedCoursesId.length === 0) throw new NoCourseStarted();

    const onGoingCourses = await Course.findAll({ where: { id: startedCoursesId.map((c) => c.courseId) } });

    return onGoingCourses;
  }

  async getLastAccessedCourse(userId) {
    const lastAccessed = await CourseUser.findOne({
      where: { userId, deleted: false },
      order: [['lastAccessed', 'DESC']],
    });

    if (!lastAccessed) throw new NoCourseStarted();

    const lastCourse = await Course.findByPk(lastAccessed.courseId);

    return lastCourse;
  }

  async getNumberOfActivities(course) {
    const newChapters = [];
    const courseToSend = {
      id: course.id,
      name: course.name,
      description: course.description,
    };
    for (let i = 0; i < course.chapters.length; i++) {
      const newChapter = {
        id: course.chapters[i].id,
        name: course.chapters[i].name,
        topics: course.chapters[i].topics,
        theoryCount: 0,
        exerciseCount: 0,
      };
      let totalTheory = 0;
      let totalExercise = 0;
      for (let j = 0; j < course.chapters[i].topics.length; j++) {
        const countExercise = await Exercise.count({
          where: {
            topicId: course.chapters[i].topics[j].id,
          },
        });
        const countTheory = await Theory.count({
          where: {
            topicId: course.chapters[i].topics[j].id,
          },
        });
        totalExercise += countExercise;
        totalTheory += countTheory;
      }
      newChapter.exerciseCount = totalExercise;
      newChapter.theoryCount = totalTheory;
      newChapters.push(newChapter);
    }
    courseToSend.chapters = newChapters;
    return courseToSend;
  }
}

module.exports = new CoursesController();
