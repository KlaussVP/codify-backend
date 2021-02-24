const InexistingId = require('../errors/InexistingId');
const Exercise = require('../models/Exercise');
const ExerciseUser = require('../models/ExerciseUser');

class ExercisesController {
  async postExerciseUser(exerciseId, userId) {
    const exercise = Exercise.findByPk(exerciseId);
    if (!exercise) throw new InexistingId();
    await ExerciseUser.findOrCreate({
      where: {
        exerciseId,
        userId,
      },
    });
  }
}

module.exports = new ExercisesController();
