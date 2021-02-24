const Chapter = require('../models/Chapter');
const InexistingId = require('../errors/InexistingId');

const topicsController = require('./topicsController');
const Topic = require('../models/Topic');
const Course = require('../models/Course');

class ChaptersController {
  async createChapter({ courseId, name }) {
    const chapter = await Chapter.create({ courseId, name });
    return chapter;
  }

  async editChapter(id, { name, courseId }) {
    const chapter = await Chapter.findByPk(id);
    if (!chapter) throw new InexistingId();
    chapter.name = name || chapter.name;
    chapter.courseId = courseId || chapter.courseId;
    await chapter.save();
    return chapter;
  }

  async deleteOneChapter(chapterId) {
    const chapter = await Chapter.findByPk(chapterId);
    if (!chapter) throw new InexistingId();
    await topicsController.deleteTopicsFromChapter(chapterId);
    await Chapter.destroy({
      where: { id: chapterId },
      cascade: true
    });
  }

  async deleteChaptersFromCourse(courseId) {
    const course = await Course.findByPk(courseId);
    if (!course) throw new InexistingId();

    const chapters = await this.getChaptersByCourse(courseId);

    for (let i = 0; i < chapters.length; i++) {
      await topicsController.deleteTopicsFromChapter(chapters[i].id);
    }

    await Chapter.destroy({
      where: { courseId },
      cascade: true
    });
  }

  async getAllChapters() {
    const chapters = await Chapter.findAll({
      include: {
        model: Topic
      },
    });
    return chapters;
  }

  async getAllChaptersAsAdmin() {
    const chapters = await Chapter.findAll({
      include: {
        model: Topic,
        attributes: ['id'],
      },
    });

    const chaptersArrayAdminFormat = [];
    chapters.forEach((chapter) => {
      const topicsIds = chapter.topics.map((t) => t.id);
      const chapterObjectToAdmin = {
        id: chapter.id,
        name: chapter.name,
        courseId: chapter.courseId,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
        topics: topicsIds,
      };
      chaptersArrayAdminFormat.push(chapterObjectToAdmin);
    });
    return chaptersArrayAdminFormat;
  }

  async getChaptersByCourse(courseId) {
    const course = await Course.findByPk(courseId);
    if (!course) throw new InexistingId();

    const chapters = await Chapter.findAll({ where: { courseId } });
    return chapters;
  }

  async getChapterById(id) {
    const chapter = await Chapter.findOne({
      where: { id },
      include: {
        model: Topic,
        attributes: ['id', 'name'],
      },
    });

    if (!chapter) throw new InexistingId();

    return chapter;
  }

  async getChapterByIdAsAdmin(id) {
    const chapter = await Chapter.findOne({
      where: { id },
      include: {
        model: Topic,
        attributes: ['id', 'name'],
      },
    });
    if (!chapter) throw new InexistingId();

    const topicsIds = chapter.topics.map((c) => c.id);

    const chapterObjectToAdmin = {
      id: chapter.id,
      name: chapter.name,
      courseId: chapter.courseId,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
      topics: topicsIds,
    };
    return chapterObjectToAdmin;
  }
}

module.exports = new ChaptersController();
