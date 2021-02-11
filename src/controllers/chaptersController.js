const Chapter = require('../models/Chapter');
const InexistingId = require('../errors/InexistingId');

const topicsController = require('./topicsController');

class ChaptersController {
  async createChapter({ courseId, name }) {
    const chapter = await Chapter.create({ courseId, name });
    return chapter;
  }

  async createListOfChapters(chapters, courseId) {
    const arrayChapters = chapters.map( c => ({ name: c.name, courseId }));
    const chaptersCreated = await Chapter.bulkCreate(arrayChapters);

    this.addAllTopicsOfOneCourse(chapters, chaptersCreated);

    return arrayChapters;
  }

  async addAllTopicsOfOneCourse(arrayChaptersWithTopics, arrayChaptersWithIds) {

    for (let i = 0; i < arrayChaptersWithTopics.length; i++ ) {
      let courseId = arrayChaptersWithIds[i].id;
      let topicsToBeAdded = arrayChaptersWithTopics[i].topics
      await topicsController.createListOfTopics(topicsToBeAdded, courseId);
    }
  }

  async deleteChaptersFromCourse(courseId) {
    await Chapter.destroy({
      where: {
        courseId,
      },
    });
  }

  async getAllChapter() {
    const chapters = await Chapter.findAll();
    return chapters;
  }

  async getChapterById(id) {
    const chapter = await Chapter.findByPk(id);
    if (!chapter) throw new InexistingId();
    return chapter;
  }
}

module.exports = new ChaptersController();
