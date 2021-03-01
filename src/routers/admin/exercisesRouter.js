const exercisesRouter = require('express').Router();
const { adminVerifyJWT } = require('../../middlewares/adminMiddlewares');
const exercisesController = require('../../controllers/exercisesController');
const { postExerciseSchema, editExerciseSchema } = require('../../schemas/exercisesSchema');

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

exercisesRouter.post('/', adminVerifyJWT, async (req, res) => {
  const validation = postExerciseSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const exercise = await exercisesController.createExercise(req.body);
  return res.status(201).send(exercise);
});

exercisesRouter.put('/:id', adminVerifyJWT, async (req, res) => {
  const validation = editExerciseSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });
  const exercise = await exercisesController.editExercise(req.params.id, req.body);
  return res.send(exercise);
});

module.exports = exercisesRouter;
