const defaults = require('../models/default');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('livros', {
    ...defaults.columns,
    titulo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantidade: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    foto: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('livros'),
};
