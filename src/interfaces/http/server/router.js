const { Router } = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const container = require('../../../iocContainer');

module.exports = ({
  config,
  containerMiddleware,
  errorHandlerMiddleware,
  // swaggerMiddleware,
  HttpControllers,
}) => {
  const router = Router();

  /* istanbul ignore if */
  if (config.env !== 'test') {
    router.use(morgan('dev'));
  }

  const apiRouter = Router();

  apiRouter
    .use(cors())
    .use(bodyParser.json())
    .use(containerMiddleware);
  // .use('/docs', swaggerMiddleware);

  // console.log(HttpControllers);

  Object.keys(HttpControllers)
    .forEach((controllerName) => {
      const controller = HttpControllers[controllerName];
      apiRouter.use(controller.BASE_PATH, controller.Router);
    });

  apiRouter.get('/', (req, res) => res.json({ a: 'b' }));

  // apiRouter.use('/auth', controller('auth/AuthController'));
  // apiRouter.use('/teachers', authService.authorize, controller('teacher/TeachersController'));

  router.use('/api', apiRouter);

  router.use(errorHandlerMiddleware);

  return router;
};
