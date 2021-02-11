const router = require('express').Router();

const { postCoursesSchema, editCourseSchema } = require('../../schemas/coursesSchema');
const coursesController = require('../../controllers/coursesController');
const authMiddleware = require('../../middlewares/authMiddleware');
const { adminVerifyJWT } = require('../../middlewares/adminMiddlewares');

// eslint-disable-next-line consistent-return
router.post('/', adminVerifyJWT, async (req, res) => {
  const validation = postCoursesSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const course = await coursesController.create(req.body);
  res.status(201).send(course);
});

router.put('/', adminVerifyJWT, async (req, res) => {
  const validation = editCourseSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const course = await coursesController.edit(req.body);
  res.status(201).send(course);
});

router.get('/', adminVerifyJWT, async (req, res) => {
  const courses = await coursesController.listAllCourses();
  res.send(courses);
});

router.get('/:id', adminVerifyJWT, async (req, res) => {
  const course = await coursesController.getCourseByIdAsAdmin(req.params.id);
  res.send(course);
});

router.delete('/:id', adminVerifyJWT, async (req, res) => {
  const deleted = await coursesController.deleteCourse(req.params.id);
  if(deleted) return res.status(202).send('ok!');
  console.log(deleted);
  return res.status(500).send({ error: 'send this to a developer'});
})

module.exports = router;
