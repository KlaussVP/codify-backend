const joi = require('joi');

const postCoursesAsAdminSchema = joi.object({
  name: joi.string().min(3).max(255).required(),
  image: joi.string().uri().required(),
  description: joi.string().required(),
});

const editCourseAsAdminSchema = joi.object({
  id: joi.number().required(),
  name: joi.string().min(3).max(255),
  image: joi.string().uri(),
  description: joi.string(),
}).unknown(true);

module.exports = {
  postCoursesAsAdminSchema,
  editCourseAsAdminSchema,
};
