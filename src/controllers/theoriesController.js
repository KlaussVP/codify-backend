const InexistingId = require('../errors/InexistingId');
const Chapter = require('../models/Chapter');
const Course = require('../models/Course');
const Theory = require('../models/Theory');
const TheoryUser = require('../models/TheoryUser');
const Topic = require('../models/Topic');

class TheoriesController {
  async postTheoryUser(theoryId, userId) {
    const theory = await Theory.findByPk(theoryId);
    if (!theory) throw new InexistingId();
    await TheoryUser.findOrCreate({
      where: {
        theoryId: theory.id,
        userId,
      },
    });
  }

  async getAllTheories() {
    const theories = await Theory.findAll({
      include: [{
        model: Topic,
        attributes: ['name'],
        include: [{
          model: Chapter,
          attributes: ['id'],
          include: [{
            model: Course,
            attributes: ['id'],
          }],
        }],
      }],
    });
    return theories;
  }

  async getTheoryByIdAsAdmin(id) {
    const theory = await Theory.findByPk(id);
    if (!theory) throw new InexistingId();
    return theory;
  }

  async editTheory(id, youtubeLink) {
    const theory = await Theory.findByPk(id);
    if (!theory) throw new InexistingId();

    theory.youtubeLink = youtubeLink;
    await theory.save();

    return theory;
  }
}

module.exports = new TheoriesController();
