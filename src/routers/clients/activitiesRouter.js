const router = require('express').Router();
const verifyJWT = require('../../middlewares/authMiddleware');
const theoriesController = require('../../controllers/theoriesController');
const exercisesController = require('../../controllers/exercisesController');

router.post('/theory/:id', verifyJWT, async (req, res) => {
  await theoriesController.postTheoryUser(req.params.id, req.userId);
  return res.sendStatus(200);
});

router.post('/exercise/:id', verifyJWT, async (req, res) => {
  await exercisesController.postExerciseUser(req.params.id, req.userId);
  return res.sendStatus(200);
});

module.exports = router;
