const topicRouter = require('express').Router();
const { adminVerifyJWT } = require('../../middlewares/adminMiddlewares');

const topicsController = require('../../controllers/topicsController');

//*************************************************************************//

topicRouter.post('/bulk', adminVerifyJWT, async (req, res) => {
  const { names, chapterId } = req.body;
  const topics = await topicsController.createListOfTopics(names, chapterId);
  res.send(topics);
});

//*************************************************************************//

topicRouter.post('/', adminVerifyJWT, async (req, res) => {
  const topic = await topicsController.createTopic(req.body);
  res.send(topic);
});

topicRouter.put('/:id', adminVerifyJWT, async (req, res) => {
  const topic = await topicsController.editTopic(req.params.id, req.body);
  res.send(topic);
});

topicRouter.get('/', async (req, res) => {
  const topics = await topicsController.getAllTopicsAsAdmin();
  res
    .header('Access-Control-Expose-Headers', 'Content-Range')
    .set('Content-Range', topics.length)
    .send(topics);
});

topicRouter.get('/:id', async (req, res) => {
  const topic = await topicsController.getTopicByIdAsAdmin(req.params.id);
  res
    .header('Access-Control-Expose-Headers', 'X-Total-Count')
    .set('X-Total-Count', 1)
    .send(topic);
});

topicRouter.delete('/:id', adminVerifyJWT, async (req, res) => {
  await topicsController.deleteOneTopic(req.params.id);
  res.sendStatus(200);
});

module.exports = topicRouter;
