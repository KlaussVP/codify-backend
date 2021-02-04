const joi = require('joi');

const postCoursesSchema = joi.object({
  name: joi.string().min(3).max(255).required(),
  image: joi.string().uri().required(),
  description: joi.string().required(),
  topics: joi.array().items(joi.object({
    name: joi.string().required(),
  })).min(1).required(),
});

const editCourseSchema = joi.object({
  id: joi.number().required(),
  name: joi.string().min(3).max(255).required(),
  image: joi.string().uri().required(),
  description: joi.string().required(),
  topics: joi.array().items(joi.object({
    name: joi.string().required(),
  })).required(),
});

module.exports = {
  postCoursesSchema,
  editCourseSchema,
};
