const joi = require('joi');

const editUserDataSchema = joi.object({
  name: joi.string().min(3).max(255),
  email: joi.string().email(),
  password: joi.string().min(6).max(255),
  confirmPassword: joi.any().valid(joi.ref('password')).messages({
    'any.only': 'Senhas diferentes.',
  }),
});

module.exports = {
  editUserDataSchema,
};
