const joi = require('joi');

const postTopicSchema = joi.object({
  name: joi.string().min(3).max(255).required(),
  chapterId: joi.number().greater(0).required(),
  youtubeLink: joi.string().uri().required(),
});

const editTopicSchema = joi.object({
  name: joi.string().min(3).max(255),
  chapterId: joi.number().greater(0),
  theory: joi.object({
    id: joi.number().greater(0),
    youtubeLink: joi.string().uri(),
  }),
}).unknown(true);

module.exports = {
  postTopicSchema,
  editTopicSchema,
};
