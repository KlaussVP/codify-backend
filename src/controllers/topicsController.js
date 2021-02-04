const Topic = require('../models/Topic');
const InexistingId = require('../errors/InexistingId');

class TopicsController {
  async createTopic({ courseId, name }) {
    const topic = await Topic.create({ courseId, name });
    return topic;
  }

  async createListOfTopics(topics, courseId) {
    const arrayTopics = topics.map((t) => ({ name: t.name, courseId }));
    await Topic.bulkCreate(arrayTopics);
  }

  async deleteTopicsFromCourse(courseId) {
    await Topic.destroy({
      where: {
        courseId,
      },
    });
  }

  async getAllTopics() {
    const topics = await Topic.findAll();
    return topics;
  }

  async getTopicById(id) {
    const topic = await Topic.findByPk(id);
    if (!topic) throw new InexistingId();
    return topic;
  }
}

module.exports = new TopicsController();
