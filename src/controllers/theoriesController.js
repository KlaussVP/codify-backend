const InexistingId = require('../errors/InexistingId');
const Theory = require('../models/Theory');
const TheoryUser = require('../models/TheoryUser');

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
}

module.exports = new TheoriesController();
