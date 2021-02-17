const chapterRouter = require('express').Router();

const chaptersController = require('../../controllers/chaptersController');

chapterRouter.get('/', async (req, res) => {
    const chapters = await chaptersController.getAllChaptersAsAdmin();
    res
    .header('Access-Control-Expose-Headers', 'Content-Range')
    .set('Content-Range', chapters.length )
    .send(chapters);
});
  
chapterRouter.get('/:id', async (req, res) => {
const chapter = await chaptersController.getChapterByIdAsAdmin(req.params.id);
res
.header('Access-Control-Expose-Headers', 'X-Total-Count')
.set('X-Total-Count', 1)
.send(chapter);
});
  
module.exports = chapterRouter;