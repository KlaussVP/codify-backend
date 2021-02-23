const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const sessionStore = require('../repositories/sessionStore');

// eslint-disable-next-line consistent-return
async function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ error: 'Token obrigatório.' });

  const decodedData = jwt.verify(token, process.env.SECRET);

  const userData = await sessionStore.getSession(token);

  if (decodedData.id !== userData.id) throw new AuthorizationError();

  req.userId = userData.id;
  next();
}

module.exports = verifyJWT;
