const defaults = require('../models/default');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('usuarios', {
    ...defaults.columns,
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    telefone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('usuarios'),
};
