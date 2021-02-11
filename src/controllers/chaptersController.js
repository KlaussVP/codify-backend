const Chapter = require('../models/Chapter');
const InexistingId = require('../errors/InexistingId');

const topicsController = require('./topicsController');
const Topic = require('../models/Topic');

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

  async getAllChapters() {
    const chapters = await Chapter.findAll();
    return chapters;
  }

  async getAllChaptersAsAdmin() {
    const chapters = await Chapter.findAll({
      include: {
        model: Topic,
        attributes: ['id'],
      }
    });

    const chaptersArrayAdminFormat = [];
    chapters.forEach( chapter => {
      const topicsIds = chapter.topics.map(t => t.id);
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

  async getChapterById(id) {
    const chapter = await Chapter.findOne({
      where: { id },
      include: {
        model: Topic,
        attributes: ['id', 'name'],
      }
    });

    if (!chapter) throw new InexistingId();
    
    return chapter;
  }

<<<<<<< HEAD
  async getChaptersByCourse(courseId) {
    const chapters = await Chapter.findAll({ where: {courseId}});
    return chapters;
=======
  async getChapterByIdAsAdmin(id) {
    const chapter = await Chapter.findOne({
      where: { id },
      include: {
        model: Topic,
        attributes: ['id', 'name'],
      }
    });
    if (!chapter) throw new InexistingId();

    const topicsIds = chapter.topics.map(c => c.id);

    const chapterObjectToAdmin = {
      id: chapter.id,
      name: chapter.name,
      courseId: chapter.courseId,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
      topics: topicsIds,
    };
    return chapterObjectToAdmin;
>>>>>>> db7b41d87c8d0cdb2ba78c66db7f6e235dff6395
  }
}

module.exports = new ChaptersController();
