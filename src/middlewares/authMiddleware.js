const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

// eslint-disable-next-line consistent-return
function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ error: 'Token obrigatório.' });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) throw new AuthorizationError();

    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyJWT;
