const jwt = require('jsonwebtoken');
const signInSchema = require('../schemas/signInSchema');
const UsersController = require('../controllers/usersController');

const AuthorizationError = require('../errors/AuthorizationError');
const ForbiddenError = require('../errors/ForbiddenError');

function signInMiddleware(req, res, next) {
  const signInValidation = signInSchema.validate(req.body).error;

  if (signInValidation) {
    return res.status(400).send({ error: 'Verifique os dados enviados.' });
  }

  return next();
}
/* eslint-disable-next-line consistent-return */
function adminVerifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ error: 'Token obrigatório.' });

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) throw new AuthorizationError();

    req.userId = decoded.id;
    const user = await UsersController.findUserById(req.userId);

    if (user.type === 'ADMIN') {
      next();
    } else {
      throw new ForbiddenError();
    }
  });
}

module.exports = {
  signInMiddleware,
  adminVerifyJWT,
};
