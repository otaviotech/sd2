const Sequelize = require('sequelize');
const configs = require('../../../../config/config.json');
const loadModels = require('./models');
const utils = require('./utils');

const env = process.env.NODE_ENV || 'development';
const config = configs[env];

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const models = loadModels(sequelize, Sequelize);

module.exports = {
  models,
  utils,
  sequelize,
  Sequelize,
};
