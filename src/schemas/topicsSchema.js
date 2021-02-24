const joi = require('joi');

const postTopicSchema = joi.object({
  name: joi.string().min(3).max(255).required(),
  chapterId: joi.number().greater(0).required(),
});

const editTopicSchema = joi.object({
  name: joi.string().min(3).max(255),
  chapterId: joi.number().greater(0),
}).unknown(true);

module.exports = {
  postTopicSchema,
  editTopicSchema,
};
