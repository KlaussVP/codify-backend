const signInSchema = require('../schemas/signInSchema');
const signUpSchema = require('../schemas/signUpSchema');
const { recoverPasswordSchema, newPasswordSchema } = require('../schemas/recoverPasswordSchema');

function signUpMiddleware(req, res, next) {
  const signupValidation = signUpSchema.validate(req.body).error;
  if (signupValidation) {
    return res.status(422).send({
      error: signupValidation.message === 'Senhas diferentes.'
        ? signupValidation.message
        : 'Verifique seus dados.',
    });
  }

  return next();
}

function signInMiddleware(req, res, next) {
  const signInValidation = signInSchema.validate(req.body).error;

  if (signInValidation) {
    return res.status(422).send({ error: 'Verifique os dados enviados.' });
  }

  return next();
}

function recoverPassword(req, res, next) {
  const validation = recoverPasswordSchema.validate(req.body).error;

  if (validation) {
    return res.status(422).send({ error: 'Verifique os dados enviados.' });
  }

  return next();
}

function newPasswordMiddleware(req, res, next) {
  const validation = newPasswordSchema.validate(req.body).error;

  if (validation) {
    return res.status(422).send({
      error: validation.message === 'Senhas diferentes.'
        ? validation.message
        : 'Verifique seus dados.',
    });
  }

  return next();
}

module.exports = {
  signUpMiddleware,
  signInMiddleware,
  recoverPassword,
  newPasswordMiddleware,
};
