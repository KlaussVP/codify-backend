const joi = require('joi');

const postChapterSchema = joi.object({
  name: joi.string().min(3).max(255).required(),
  chapterId: joi.number().greater(0).required(),
});

const editChapterSchema = joi.object({
  name: joi.string().min(3).max(255),
  chapterId: joi.number().greater(0),
}).unknown(true);

module.exports = {
    postChapterSchema,
    editChapterSchema,
};