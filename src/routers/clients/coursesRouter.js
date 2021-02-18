const router = require('express').Router();

const coursesController = require('../../controllers/coursesController');
const verifyJWT = require('../../middlewares/authMiddleware');

router.get('/', async (req, res) => {
  const courses = await coursesController.listAllCourses();
  res.send(courses);
});

router.get('/:id', async (req, res) => {
  const course = await coursesController.getCourseById(req.params.id);
  res.send(course);
});

router.post('/:id', verifyJWT, async (req, res) => {
  await coursesController.startOrContinueCourse(req.params.id, req.userId);
  res.sendStatus(200);
});

module.exports = router;
