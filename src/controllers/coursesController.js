const Course = require('../models/Course');
const ConflictError = require('../errors/ConflictError');
const InexistingId = require('../errors/InexistingId');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const chaptersController = require('./chaptersController');
const topicsController = require('./topicsController');

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
    id, name, image, description, chapters,
  }) {
    const course = await this.getCourseById(id);
    if (!course) throw new InexistingId();

    course.name = name || course.name;
    course.image = image || course.image;
    course.description = description || course.description;

    if (chapters) {
      await chaptersController.deleteChaptersFromCourse(course.id);
      await chaptersController.createListOfChapters(chapters, course.id);
    }

    await course.save();

    const courseObject = await this.getCourseById(course.id);
    return courseObject;
  }

  async deleteCourse(id) {
    const course = await this.getCourseById(id);
    if (!course) throw new InexistingId();

    course.deleted = true;
    await course.save();

    return true;
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

  async getCourseByIdAsAdmin(id) {
    const course = await Course.findOne({
      where: { id },
      include: [{
        model: Chapter,
        attributes: ['id', 'name'],
      }],
    });
    if (!course) throw new InexistingId();

   const chaptersIds = course.chapters.map(c => c.id);

    const courseObjectToAdmin = {
      id: course.id,
      name: course.name,
      deleted: course.deleted,
      image: course.image,
      description:course.description,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      chapters: chaptersIds,
    };
    return courseObjectToAdmin;
  }


  // async updateCourseAccess() {

  // }
}

module.exports = new CoursesController();
