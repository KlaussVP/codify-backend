const chapterRouter = require('express').Router();
const { adminVerifyJWT } = require('../../middlewares/adminMiddlewares');
const chaptersController = require('../../controllers/chaptersController');

chapterRouter.post('/', adminVerifyJWT, async (req, res) => {
  const chapter = await chaptersController.createChapter(req.body);
  res.send(chapter);
});

chapterRouter.put('/:id', adminVerifyJWT, async (req, res) => {
  const chapter = await chaptersController.editChapter(req.params.id, req.body);
  res.send(chapter);
});

chapterRouter.get('/', async (req, res) => {
  const chapters = await chaptersController.getAllChaptersAsAdmin();
  res
    .header('Access-Control-Expose-Headers', 'Content-Range')
    .set('Content-Range', chapters.length)
    .send(chapters);
});

chapterRouter.get('/:id', async (req, res) => {
  const chapter = await chaptersController.getChapterByIdAsAdmin(req.params.id);
  res
    .header('Access-Control-Expose-Headers', 'X-Total-Count')
    .set('X-Total-Count', 1)
    .send(chapter);
});

chapterRouter.delete('/:id', adminVerifyJWT, async (req, res) => {
  await chaptersController.deleteOneChapter(req.params.id);
  res.sendStatus(200);
});

module.exports = chapterRouter;
