const router = require('express').Router();
const coursesController = require('../../controllers/coursesController');
const verifyJWT = require('../../middlewares/authMiddleware');

router.get('/', verifyJWT, async (req, res) => {
  const courses = await coursesController.listAllCourses();
  res.send(courses);
});

router.get('/started', verifyJWT, async (req, res) => {
  const courses = await coursesController.listStartedCourses(req.userId);
  return res.send(courses);
});

router.get('/last-accessed', verifyJWT, async (req, res) => {
  const course = await coursesController.getLastAccessedCourse(req.userId);
  return res.send(course);
});

router.get('/:id', verifyJWT, async (req, res) => {
  const course = await coursesController.getCourseWithNumberActivities(req.params.id, req.userId);
  res.send(course);
});

router.post('/:id', verifyJWT, async (req, res) => {
  const ids = await coursesController.startOrContinueCourse(req.params.id, req.userId);
  res.send(ids);
});

router.get('/:id/activities', verifyJWT, async (req, res) => {
  const course = await coursesController.getCourseByIdComplete(req.params.id, req.userId);
  res.send(course);
});

module.exports = router;
