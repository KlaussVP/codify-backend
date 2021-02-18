const joi = require('joi');

const postCoursesSchema = joi.object({
  name: joi.string().min(3).max(255).required(),
  image: joi.string().uri().required(),
  description: joi.string().required(),
  chapters: joi.array().items(joi.object({
    name: joi.string().required(),
    topics: joi.array().items(joi.object({
      name: joi.string().required(),
    })).min(1).required(),
  })).min(1).required(),
});

const postCoursesAsAdminSchema = joi.object({
  name: joi.string().min(3).max(255).required(),
  image: joi.string().uri().required(),
  description: joi.string().required(),
});

const editCourseSchema = joi.object({
  id: joi.number().required(),
  name: joi.string().min(3).max(255),
  image: joi.string().uri(),
  description: joi.string(),
  chapters: joi.array().items(joi.object({
    name: joi.string().required(),
    topics: joi.array().items(joi.object({
      name: joi.string().required(),
    })).min(1).required(),
  })).min(1),
});

const editCourseAsAdminSchema = joi.object({
  id: joi.number().required(),
  name: joi.string().min(3).max(255),
  image: joi.string().uri(),
  description: joi.string(),
}).unknown(true);

module.exports = {
  postCoursesSchema,
  editCourseSchema,
  postCoursesAsAdminSchema,
  editCourseAsAdminSchema,
};
