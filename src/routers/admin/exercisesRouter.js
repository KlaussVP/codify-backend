const exercisesRouter = require('express').Router();
const { adminVerifyJWT } = require('../../middlewares/adminMiddlewares');
const exercisesController = require('../../controllers/exercisesController');

exercisesRouter.get('/', adminVerifyJWT, async (req, res) => {
  const exercises = await exercisesController.getAllExercises();
  res
    .header('Access-Control-Expose-Headers', 'Content-Range')
    .set('Content-Range', exercises.length)
    .send(exercises);
});

exercisesRouter.get('/:id', adminVerifyJWT, async (req, res) => {
  const exercise = await exercisesController.getExerciseByIdAsAdmin(req.params.id);
  res
    .header('Access-Control-Expose-Headers', 'X-Total-Count')
    .set('X-Total-Count', 1)
    .send(exercise);
});

module.exports = exercisesRouter;
