const awilix = require('awilix');
const { scopePerRequest } = require('awilix-express');
const { pipe } = require('ramda');
const appSequelize = require('./infra/database/sequelize');
const logger = require('./infra/logging/log4js.logger');
const loggerMiddleware = require('./interfaces/http/loggers/morgan.logger');
const errorHandlerMiddleware = require('./interfaces/http/errorHandlers/default.errorHandler');
const HttpServer = require('./interfaces/http/server');
const HttpRouter = require('./interfaces/http/server/router');
const config = require('../config');

const capitalize = (str = '') => str.replace(/^(.)/, (f) => f.toString().toUpperCase());
const capitalizeAndConcat = (suffix = '') => (str = '') => capitalize(str).concat(suffix);
const untilFirstDot = (str = '') => str.split('.')[0];

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  sequelizeConnection: awilix.asValue(appSequelize.sequelize, {
    lifetime: awilix.Lifetime.SINGLETON,
  }),
  SequelizeModels: awilix.asValue(appSequelize.models, {
    lifetime: awilix.Lifetime.SINGLETON,
  }),
});

Object.keys(appSequelize.models).forEach((modelName) => {
  const entry = `${modelName}SequelizeModel`;

  container.register({
    [entry]: awilix.asValue(appSequelize.models[modelName], {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
  });
});

container.loadModules([
  'src/infra/database/sequelize/repositories/*.repository.js',
], {
  formatName: pipe(untilFirstDot, capitalizeAndConcat('SequelizeRepository')),
  register: awilix.asClass,
  lifetime: awilix.Lifetime.SINGLETON,
});

container.register({
  ParseSequelizeIncludes: awilix.asValue(appSequelize.utils.createParseIncludesFn(container.resolve('SequelizeModels'))),
});

// System
container.register({
  HttpRouter: awilix.asFunction(HttpRouter, { lifetime: awilix.Lifetime.SINGLETON }),
  // HttpApplication: awilix.asClass(HttpApplication, { lifetime: awilix.Lifetime.SINGLETON }),
  HttpServer: awilix.asFunction(HttpServer, { lifetime: awilix.Lifetime.SINGLETON }),
  logger: awilix.asFunction(logger, { lifetime: awilix.Lifetime.SINGLETON }),
  loggerMiddleware: awilix.asFunction(loggerMiddleware, { lifetime: awilix.Lifetime.SINGLETON }),
  containerMiddleware: awilix.asValue(scopePerRequest(container)),
  errorHandlerMiddleware: awilix.asValue(errorHandlerMiddleware),
  config: awilix.asValue(config),
  // swaggerMiddleware: [swaggerMiddleware],
});

container.loadModules([
  'src/interfaces/http/controllers/*.controller.js',
], {
  formatName: pipe(untilFirstDot, capitalizeAndConcat('HttpController')),
  register: awilix.asClass,
  lifetime: awilix.Lifetime.SINGLETON,
});

const HttpControllers = Object.keys(container.registrations)
  .filter((r) => /HttpController$/.test(r))
  .reduce((controllers, controller) => {
  controllers[controller] = container.resolve(controller); // eslint-disable-line
    return controllers;
  }, {});

// console.log(HttpControllers);

container.register({
  HttpControllers: awilix.asValue(HttpControllers, {
    lifetime: awilix.Lifetime.SINGLETON,
  }),
});

module.exports = container;
