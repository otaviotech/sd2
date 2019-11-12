const defaults = require('../models/default');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('autores', {
    ...defaults.columns,
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('autores'),
};
