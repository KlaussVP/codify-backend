const chapterRouter = require('express').Router();
const { adminVerifyJWT } = require('../../middlewares/adminMiddlewares');
const chaptersController = require('../../controllers/chaptersController');
const { postChapterSchema, editChapterSchema } = require('../../schemas/chaptersSchema');

chapterRouter.post('/', adminVerifyJWT, async (req, res) => {
  const validation = postChapterSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const chapter = await chaptersController.createChapter(req.body);
  return res.status(201).send(chapter);
});

chapterRouter.put('/:id', adminVerifyJWT, async (req, res) => {
  const validation = editChapterSchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });

  const chapter = await chaptersController.editChapter(req.params.id, req.body);
  return res.send(chapter);
});

chapterRouter.get('/', async (req, res) => {
  const chapters = await chaptersController.getAllChaptersAsAdmin();
  return res
    .header('Access-Control-Expose-Headers', 'Content-Range')
    .set('Content-Range', chapters.length)
    .send(chapters);
});

chapterRouter.get('/:id', async (req, res) => {
  const chapter = await chaptersController.getChapterByIdAsAdmin(req.params.id);
  return res
    .header('Access-Control-Expose-Headers', 'X-Total-Count')
    .set('X-Total-Count', 1)
    .send(chapter);
});

chapterRouter.delete('/:id', adminVerifyJWT, async (req, res) => {
  await chaptersController.deleteOneChapter(req.params.id);
  return res.sendStatus(202);
});

module.exports = chapterRouter;
