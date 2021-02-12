const Course = require('../models/Course');
const ConflictError = require('../errors/ConflictError');
const InexistingId = require('../errors/InexistingId');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const chaptersController = require('./chaptersController');
const topicsController = require('./topicsController');
const CourseUser = require('../models/CourseUser');

class CoursesController {
  async findCourseByName(name) {
    const course = await Course.findOne({ where: { name } });
    return course;
  }

  async create({
    name, image, description, chapters,
  }) {
    const coursesExists = await this.findCourseByName(name);
    if (coursesExists) throw new ConflictError();

    const course = await Course.create({ name, image, description });
    await chaptersController.createListOfChapters(chapters, course.id);

    const courseObject = await this.getCourseById(course.id);
    return courseObject;
  }

  async edit({
    id, name, image, description, topics,
  }) {
    const course = await this.getCourseById(id);
    if (!course) throw new InexistingId();

    course.name = name || course.name;
    course.image = image || course.image;
    course.description = description || course.description;

    if (topics) {
      await chaptersController.deleteTopicsFromCourse(course.id);
      await chaptersController.createListOfTopics(topics, course.id);
    }

    await course.save();

    const courseObject = await this.getCourseById(course.id);
    return courseObject;
  }

  async listAllCourses() {
    const courses = await Course.findAll();
    return courses;
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
        }
      }],
    });
    if (!course) throw new InexistingId();

    return course;
  }

  async startOrContinueCourse(courseId, userId) {
    const [startedCourse, created] = await CourseUser.findOrCreate({ 
      where: {
        courseId,
        userId
      } 
    });

    if (!created) {
      await CourseUser.update({ lastAccessed: new Date() }, { 
        where: {
          courseId,
          userId
        } 
      });
    }
  }
}

module.exports = new CoursesController();
