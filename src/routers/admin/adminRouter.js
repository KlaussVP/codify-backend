const express = require('express');
const verifyJWT = require('../../middlewares/authMiddleware');

const router = express.Router();

const usersController = require('../../controllers/usersController');
const adminMiddlewares = require('../../middlewares/adminMiddlewares');

router.post('/signin', adminMiddlewares.signInMiddleware, async (req, res) => {
  const user = await usersController.postSignIn(req.body, 'ADMIN');
  return res.status(200).send(user);
});

router.post('/logout', verifyJWT, async (req, res) => {
  await usersController.postSignOut(req.token);
  return res.sendStatus(200);
});

module.exports = router;
