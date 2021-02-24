const signInSchema = require('../schemas/signInSchema');
const signUpSchema = require('../schemas/signUpSchema');

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

module.exports = {
  signUpMiddleware,
  signInMiddleware,
};
