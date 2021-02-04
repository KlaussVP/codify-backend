const Course = require('../models/Course');
const ConflictError = require('../errors/ConflictError');
const InexistingId = require('../errors/InexistingId');
const Topic = require('../models/Topic');
const topicsController = require('./topicsController');

class CoursesController {
  async findCourseByName(name) {
    const course = await Course.findOne({ where: { name } });
    return course;
  }

  async create({
    name, image, description, topics,
  }) {
    const coursesExists = await this.findCourseByName(name);
    if (coursesExists) throw new ConflictError();

    const course = await Course.create({ name, image, description });
    await topicsController.createListOfTopics(topics, course.id);

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
      await topicsController.deleteTopicsFromCourse(course.id);
      await topicsController.createListOfTopics(topics, course.id);
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
        model: Topic,
        attributes: ['id', 'name'],
      }],
    });
    if (!course) throw new InexistingId();

    return course;
  }
}

module.exports = new CoursesController();
