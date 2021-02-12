const topicRouter = require('express').Router();

const topicsController = require('../../controllers/topicsController');

topicRouter.get('/', async (req, res) => {
    const topics = await topicsController.getAllTopicsAsAdmin();
    res
    .header('Access-Control-Expose-Headers', 'X-Total-Count')
    .set('X-Total-Count', topics.length)
    .send(topics);
});
  
topicRouter.get('/:id', async (req, res) => {
    const topic = await topicsController.getTopicByIdAsAdmin(req.params.id);
    res
    .header('Access-Control-Expose-Headers', 'X-Total-Count')
    .set('X-Total-Count', 1)
    .send(topic);
});
  
module.exports = topicRouter;