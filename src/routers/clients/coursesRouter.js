const router = require('express').Router();

const { postCoursesSchema } = require('../../schemas/coursesSchema');
const coursesController = require('../../controllers/coursesController');

router.get('/', async (req, res) => {
  const courses = await coursesController.listAllCourses();
  res.send(courses);
});

router.get('/:id', async (req, res) => {
  const course = await coursesController.getCourseById(req.params.id);
  res.send(course);
});

// router.post('/:id', async (req, res) => {
//   await coursesController.updateCourseAccess(req.params.id, req.body.userId);
//   res.sendStatus(200);
// });

module.exports = router;
