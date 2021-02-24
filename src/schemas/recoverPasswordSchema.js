const joi = require('joi');

const recoverPasswordSchema = joi.object({
  email: joi.string().email().required(),
});

module.exports = {
  recoverPasswordSchema,
};
