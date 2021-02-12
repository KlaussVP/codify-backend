const Topic = require('../models/Topic');
const InexistingId = require('../errors/InexistingId');

class TopicsController {
  async createTopic({ chapterId, name }) {
    const topic = await Topic.create({ chapterId, name });
    return topic;
  }

  async createListOfTopics(topics, chapterId) {
    const arrayTopics = topics.map((t) => ({ name: t.name, chapterId }));
    await Topic.bulkCreate(arrayTopics);
    return arrayTopics;
  }

  async deleteTopicsFromCourse(chapterId) {
    await Topic.destroy({
      where: {
        chapterId,
      },
    });
  }

  async getAllTopics() {
    const topics = await Topic.findAll();
    return topics;
  }

  async getAllTopicsAsAdmin() {
    const topics = await Topic.findAll();
    return topics;
  }

  async getTopicByIdAsAdmin(id) {
    const topic = await Topic.findByPk(id);
    if (!topic) throw new InexistingId();
    return topic;
  }
}

module.exports = new TopicsController();
