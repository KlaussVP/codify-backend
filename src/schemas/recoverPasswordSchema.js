const joi = require('joi');

const recoverPasswordSchema = joi.object({
  email: joi.string().email().required(),
});

const newPasswordSchema = joi.object({
  password: joi.string().min(6).max(255).required(),
  confirmPassword: joi.any().valid(joi.ref('password')).required().messages({
    'any.only': 'Senhas diferentes.',
  }),
  token: joi.string().guid({
    version: [
      'uuidv4',
    ],
  }).required(),
});

module.exports = {
  recoverPasswordSchema,
  newPasswordSchema,
};
