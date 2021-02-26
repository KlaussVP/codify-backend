const joi = require('joi');

const editTheorySchema = joi.object({
  youtubeLink: joi.string().uri().required(),
}).unknown(true);

module.exports = {
  editTheorySchema,
};
