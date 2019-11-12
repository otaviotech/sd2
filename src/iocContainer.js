const awilix = require('awilix');
const { pipe } = require('ramda');
const appSequelize = require('./infra/database/sequelize');

const capitalize = (str = '') => str.replace(/^(.)/, (f) => f.toString().toUpperCase());
const capitalizeAndConcat = (suffix = '') => (str = '') => capitalize(str).concat(suffix);
const untilFirstDot = (str = '') => str.split('.')[0];

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
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

module.exports = container;
