const Topic = require('../models/Topic');
const InexistingId = require('../errors/InexistingId');
const Chapter = require('../models/Chapter');
const Theory = require('../models/Theory');

class TopicsController {
  async createTopic({ chapterId, name, youtubeLink }) {
    const chapter = await Chapter.findByPk(chapterId);
    if (!chapter) throw new InexistingId();

    const topic = await Topic.create({ chapterId, name });
    await Theory.create({ youtubeLink, topicId: topic.id });

    const topicToSend = await Topic.findOne({
      where: {
        id: topic.id,
      },
      include: [{
        model: Theory,
        attributes: ['id', 'youtubeLink'],
      }],
    });

    return topicToSend;
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

  async getAllTopics(filter) {
    const topics = await Topic.findAll({
      include: [{
        model: Theory,
        attributes: ['id', 'youtubeLink'],
      }],
      where: filter,
    });
    return topics;
  }

  async getTopicByIdAsAdmin(id) {
    const topic = await Topic.findByPk(id);
    if (!topic) throw new InexistingId();
    return topic;
  }

  async editTopic(id, { name, chapterId, theory }) {
    const topic = await Topic.findByPk(id);
    if (!topic) throw new InexistingId();

    const theoryResult = await Theory.findByPk(theory.id);
    if (!theoryResult) throw new InexistingId();

    topic.name = name || topic.name;
    topic.chapterId = chapterId || topic.chapterId;
    await topic.save();

    theoryResult.youtubeLink = theory.youtubeLink || theoryResult.youtubeLink;
    await theoryResult.save();

    const topicToSend = await Topic.findOne({
      where: {
        id: topic.id,
      },
      include: [{
        model: Theory,
        attributes: ['id', 'youtubeLink'],
      }],
    });

    return topicToSend;
  }

  async deleteOneTopic(id) {
    const topic = await Topic.findByPk(id);
    if (!topic) throw new InexistingId();

    await Theory.destroy({
      where: {
        topicId: id,
      },
    });

    await Topic.destroy({
      where: { id },
    });
  }
}

module.exports = new TopicsController();
