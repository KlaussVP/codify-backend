const express = require('express');

const router = express.Router();

const usersController = require('../../controllers/usersController');
const adminMiddlewares = require('../../middlewares/adminMiddlewares');

router.post('/signin', adminMiddlewares.signInMiddleware, async (req, res) => {
  const user = await usersController.postSignIn(req.body, 'ADMIN');
  return res.status(200).send(user);
});

module.exports = router;
