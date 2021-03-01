const InexistingId = require('../errors/InexistingId');
const Exercise = require('../models/Exercise');
const ExerciseUser = require('../models/ExerciseUser');
const Chapter = require('../models/Chapter');
const Course = require('../models/Course');
const Topic = require('../models/Topic');

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

  async getAllExercises() {
    const exercises = Exercise.findAll({
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
    return exercises;
  }

  async getExerciseByIdAsAdmin(id) {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) throw new InexistingId();
    return exercise;
  }

  async createExercise(exerciseInfo) {
    const topic = await Topic.findByPk(exerciseInfo.topicId);
    if (!topic) throw new InexistingId();
    const exercise = await Exercise.create(exerciseInfo);
    return exercise;
  }

  async editExercise(id, editExerciseInfo) {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) throw new InexistingId();

    exercise.baseCode = editExerciseInfo.baseCode || exercise.baseCode;
    exercise.testCode = editExerciseInfo.testCode || exercise.testCode;
    exercise.solutionCode = editExerciseInfo.solutionCode || exercise.solutionCode;
    exercise.statement = editExerciseInfo.statement || exercise.statement;
    exercise.position = editExerciseInfo.position || exercise.position;

    await exercise.save();

    return exercise;
  }

  async deleteOneExercise(id) {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) throw new InexistingId();
    await exercise.destroy();
  }
}

module.exports = new ExercisesController();
