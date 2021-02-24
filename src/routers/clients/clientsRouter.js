const express = require('express');
const verifyJWT = require('../../middlewares/authMiddleware');

const router = express.Router();

const usersController = require('../../controllers/usersController');
const clientsMiddlewares = require('../../middlewares/clientsMiddlewares');

router.post('/signup', clientsMiddlewares.signUpMiddleware, async (req, res) => {
  await usersController.postSignUp(req.body);
  return res.sendStatus(201);
});

router.post('/signin', clientsMiddlewares.signInMiddleware, async (req, res) => {
  const user = await usersController.postSignIn(req.body, 'CLIENT');
  return res.status(200).send(user);
});

router.post('/logout', verifyJWT, async (req, res) => {
  await usersController.postSignOut(req.token);
  return res.sendStatus(200);
});

router.post('/recover-password', clientsMiddlewares.recoverPassword, async (req, res) => {
  const user = await usersController.sendEmailWithToken(req.body);
  return res.status(200).send(user);
});

module.exports = router;
