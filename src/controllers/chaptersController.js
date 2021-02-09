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

    for (let i = 0; i < chapters.length; i++ ) {
      let chapterCreated = chaptersCreated[i];
      await topicsController.createListOfTopics(chapters[i].topics, chapterCreated.id);
    }
    return arrayChapters;
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
