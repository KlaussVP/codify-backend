const topicRouter = require('express').Router();
const { adminVerifyJWT } = require('../../middlewares/adminMiddlewares');

const topicsController = require('../../controllers/topicsController');
const { postTopicSchema, editTopicSchema } = require('../../schemas/topicsSchema');

topicRouter.post('/', adminVerifyJWT, async (req, res) => {
  const validation = postTopicSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const topic = await topicsController.createTopic(req.body);
  return res.status(201).send(topic);
});

topicRouter.put('/:id', adminVerifyJWT, async (req, res) => {
  const validation = editTopicSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const topic = await topicsController.editTopic(req.params.id, req.body);
  return res.send(topic);
});

topicRouter.get('/', async (req, res) => {
  const topics = await topicsController.getAllTopics();
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
