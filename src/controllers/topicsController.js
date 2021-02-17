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

  async deleteTopicsFromChapter(chapterId) {
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

  async editTopic(id, {name, chapterId}) {
      const topic = await Topic.findByPk(id);
      topic.name = name || topic.name;
      topic.chapterId = chapterId || topic.chapterId;
      await topic.save();
      return topic;
  }

  async deleteOneTopic(id) {
    await Topic.destroy({
      where: { id },
    });
  }
}

module.exports = new TopicsController();
