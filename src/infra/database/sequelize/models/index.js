const fs = require('fs');
const path = require('path');

function loadModels(sequelize, Sequelize) {
  const models = Object.assign({}, ...fs.readdirSync(__dirname)
    .filter((file) => (file.indexOf('.') !== 0) && (/\.model\.js$/.test(file)))
    .map((file) => {
      const model = require(path.join(__dirname, file)); /* eslint-disable-line */
      return {
        [model.name]: model.init(sequelize, Sequelize.DataTypes),
      };
    }));

  // Load model associations
  /* eslint-disable */
  for (const model of Object.keys(models)) {
    typeof models[model].associate === 'function' && models[model].associate(models);
  }
  /* eslint-enable */

  return models;
}

module.exports = loadModels;
