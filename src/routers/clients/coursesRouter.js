const router = require('express').Router();

const { postCoursesSchema } = require('../../schemas/coursesSchema');
const coursesController = require('../../controllers/coursesController');

// eslint-disable-next-line consistent-return
router.get('/', async (req, res) => {
  const courses = await coursesController.listAllCourses();
  res.send(courses);
});

router.get('/:id', async (req, res) => {
  const course = await coursesController.getCourseById(req.params.id);
  res.send(course);
});

module.exports = router;
