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
    const chapters = await this.getChaptersByCourse(courseId);
    
    chapters.map((e) => {
    })

    for(let i = 0; i < chapters.length; i++){
      await topicsController.deleteTopicsFromChapter(chapters[i].id);
    }

    await Chapter.destroy({
      where: {
        courseId,
      }, 
      cascade: true,
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

  async getChaptersByCourse(courseId) {
    const chapters = await Chapter.findAll({ where: {courseId}});
    return chapters;
  }
}

module.exports = new ChaptersController();
