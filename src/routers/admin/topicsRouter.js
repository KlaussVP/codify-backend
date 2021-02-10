const topicRouter = require('express').Router();

const topicsController = require('../../controllers/topicsController');

topicRouter.get('/', async (req, res) => {
    const topics = await topicsController.getAllTopicsAsAdmin();
    res.send(topics);
});
  
topicRouter.get('/:id', async (req, res) => {
    const topic = await topicsController.getTopicByIdAsAdmin(req.params.id);
    res.send(topic);
});
  
module.exports = topicRouter;