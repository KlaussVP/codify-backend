const theoriesRouter = require('express').Router();
const { adminVerifyJWT } = require('../../middlewares/adminMiddlewares');

const theoriesController = require('../../controllers/theoriesController');
const { editTheorySchema } = require('../../schemas/theoriesSchema');

theoriesRouter.get('/', adminVerifyJWT, async (req, res) => {
  const theories = await theoriesController.getAllTheories();
  res
    .header('Access-Control-Expose-Headers', 'Content-Range')
    .set('Content-Range', theories.length)
    .send(theories);
});

theoriesRouter.get('/:id', adminVerifyJWT, async (req, res) => {
  const theory = await theoriesController.getTheoryByIdAsAdmin(req.params.id);
  res
    .header('Access-Control-Expose-Headers', 'X-Total-Count')
    .set('X-Total-Count', 1)
    .send(theory);
});

theoriesRouter.put('/:id', adminVerifyJWT, async (req, res) => {
  const validation = editTheorySchema.validate(req.body);
  if (validation.error) return res.status(422).send({ error: 'Verifique seus dados' });
  const theory = await theoriesController.editTheory(req.params.id, req.body.youtubeLink);
  return res.send(theory);
});

module.exports = theoriesRouter;
