require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('express-async-errors');
require('./utils/loadRelationships');
const ConflictError = require('./errors/ConflictError');
const InexistingId = require('./errors/InexistingId');
const AuthorizationError = require('./errors/AuthorizationError');
const ForbiddenError = require('./errors/ForbiddenError');
const NoCourseStarted = require('./errors/NoCourseStarted');

const app = express();
const clientsRouter = require('./routers/clients/clientsRouter');
const clientsCoursesRouter = require('./routers/clients/coursesRouter');

const adminRouter = require('./routers/admin/adminRouter');
const {
  coursesRouter,
  chapterRouter,
  topicRouter,
} = require('./routers/admin/coursesRouter');

app.use(cors());
app.use(express.json());

app.use('/clients', clientsRouter);
app.use('/clients/courses', clientsCoursesRouter);
app.use('/admin', adminRouter);

app.use('/admin/courses', coursesRouter);
app.use('/admin/chapters', chapterRouter);
app.use('/admin/topics', topicRouter);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error instanceof ConflictError) return res.status(409).send({ error: 'Conflito de dados.' });
  if (error instanceof InexistingId) return res.status(403).send({ error: 'Id inexistente.' });
  if (error instanceof AuthorizationError) return res.status(401).send({ error: 'Não autorizado.' });
  if (error instanceof ForbiddenError) return res.status(403).send({ error: 'Não autorizado.' });
  if (error instanceof NoCourseStarted) return res.status(404).send({ error: 'Nenhum curso iniciado.' });

  console.error(error);
  return res.status(500).json(error);
});

module.exports = app;
