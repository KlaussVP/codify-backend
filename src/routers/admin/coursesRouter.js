const router = require('express').Router();

const { postCoursesSchema } = require('../../schemas/coursesSchema');
const coursesController = require('../../controllers/coursesController');

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  const validation = postCoursesSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const course = await coursesController.create(req.body);
  res.status(201).send(course);
});

router.put('/', async (req, res) => {
  const validation = editCourseSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const course = await coursesController.edit(req.body);
  res.status(201).send(course);
});

router.get('/', async (req, res) => {
    console.log("sasasa");
  const courses = await coursesController.listAllCourses();
  res.send(courses);
});

router.get('/:id', async (req, res) => {
  const course = await coursesController.getCourseById(req.params.id);
  res.send(course);
});

module.exports = router;
