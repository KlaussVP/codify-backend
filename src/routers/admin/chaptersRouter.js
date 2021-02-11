const chapterRouter = require('express').Router();

const chaptersController = require('../../controllers/chaptersController');

chapterRouter.get('/', async (req, res) => {
    const chapters = await chaptersController.getAllChaptersAsAdmin();
    res.send(chapters);
});
  
chapterRouter.get('/:id', async (req, res) => {
const chapter = await chaptersController.getChapterByIdAsAdmin(req.params.id);
res.send(chapter);
});
  
module.exports = chapterRouter;