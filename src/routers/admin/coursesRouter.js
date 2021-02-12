const coursesRouter = require('express').Router();

const { postCoursesSchema, editCourseSchema } = require('../../schemas/coursesSchema');
const coursesController = require('../../controllers/coursesController');
const { adminVerifyJWT } = require('../../middlewares/adminMiddlewares');

chapterRouter = require('./chaptersRouter');
topicRouter = require('./topicsRouter');

coursesRouter.post('/', adminVerifyJWT, async (req, res) => {
  const validation = postCoursesSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const course = await coursesController.create(req.body);
  res.status(201).send(course);
});

coursesRouter.put('/:id', adminVerifyJWT, async (req, res) => {
  const validation = editCourseSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const course = await coursesController.edit(req.params.id, req.body);
  res.status(201).send(course);
});

coursesRouter.get('/', adminVerifyJWT, async (req, res) => {
  const courses = await coursesController.listAllCoursesAsAdmin();
  
  res
    .header('Access-Control-Expose-Headers', 'X-Total-Count')
    .set('X-Total-Count', courses.length)
    .send(courses);
});

coursesRouter.get('/:id', adminVerifyJWT, async (req, res) => {
  const course = await coursesController.getCourseByIdAsAdmin(req.params.id);  res
  .header('Access-Control-Expose-Headers', 'X-Total-Count')
  .set('X-Total-Count', 1)
  .send(course);
});

coursesRouter.delete('/:id', adminVerifyJWT, async (req, res) => {
  const deleted = await coursesController.deleteCourse(req.params.id);
  if(deleted) return res.status(202).send('ok!');
  console.log(deleted);
  return res.status(500).send({ error: 'send this to a developer'});
});

module.exports = {
  coursesRouter,
  chapterRouter,
  topicRouter,
};
