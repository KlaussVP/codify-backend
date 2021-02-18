const coursesRouter = require('express').Router();
const chapterRouter = require('./chaptersRouter');
const topicRouter = require('./topicsRouter');

const { postCoursesAsAdminSchema, editCourseAsAdminSchema } = require('../../schemas/coursesSchema');
const coursesController = require('../../controllers/coursesController');
const { adminVerifyJWT } = require('../../middlewares/adminMiddlewares');

coursesRouter.post('/', adminVerifyJWT, async (req, res) => {
  const validation = postCoursesAsAdminSchema.validate(req.body);

  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const course = await coursesController.createAsAdmin(req.body);
  return res.status(201).send(course);
});

coursesRouter.put('/:id', adminVerifyJWT, async (req, res) => {
  const validation = editCourseAsAdminSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const course = await coursesController.editAsAdmin(req.body);
  return res.status(201).send(course);
});

coursesRouter.get('/', adminVerifyJWT, async (req, res) => {
  const courses = await coursesController.listAllCoursesAsAdmin();

  return res
    .header('Access-Control-Expose-Headers', 'Content-Range')
    .set('Content-Range', courses.length)
    .send(courses);
});

coursesRouter.get('/:id', adminVerifyJWT, async (req, res) => {
  const course = await coursesController.getCourseByIdAsAdmin(req.params.id);
  return res
    .header('Access-Control-Expose-Headers', 'X-Total-Count')
    .set('X-Total-Count', 1)
    .send(course);
});

coursesRouter.delete('/:id', adminVerifyJWT, async (req, res) => {
  const deleted = await coursesController.deleteCourse(req.params.id);
  if (deleted) return res.status(202).send('ok!');
  return res.status(500).send({ error: 'send this to a developer' });
});

module.exports = {
  coursesRouter,
  chapterRouter,
  topicRouter,
};
