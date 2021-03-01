const joi = require('joi');

const postExerciseSchema = joi.object({
  topicId: joi.number().greater(0).required(),
  baseCode: joi.string().min(10).required(),
  testCode: joi.string().min(10).required(),
  solutionCode: joi.string().min(10).required(),
  statement: joi.string().min(10).required(),
  position: joi.number().required(),
});

const editExerciseSchema = joi.object({
  topicId: joi.number().greater(0),
  baseCode: joi.string().min(10),
  testCode: joi.string().min(10),
  solutionCode: joi.string().min(10),
  statement: joi.string().min(10),
  position: joi.number(),
});

module.exports = {
  postExerciseSchema,
  editExerciseSchema,
};
