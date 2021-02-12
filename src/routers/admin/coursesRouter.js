const coursesRouter = require('express').Router();

const { postCoursesSchema } = require('../../schemas/coursesSchema');
const coursesController = require('../../controllers/coursesController');
chapterRouter = require('./chaptersRouter');
topicRouter = require('./topicsRouter');

// eslint-disable-next-line consistent-return
coursesRouter.post('/', async (req, res) => {
  const validation = postCoursesSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const course = await coursesController.create(req.body);
  res.status(201).send(course);
});

coursesRouter.put('/', async (req, res) => {
  const validation = editCourseSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const course = await coursesController.edit(req.body);
  res.status(201).send(course);
});

coursesRouter.get('/', async (req, res) => {
  const courses = await coursesController.listAllCoursesAsAdmin();
  res.send(courses);
});

coursesRouter.get('/:id', async (req, res) => {
  const course = await coursesController.getCourseByIdAsAdmin(req.params.id);
  res.send(course);
});

module.exports = {
  coursesRouter,
  chapterRouter,
  topicRouter
};
