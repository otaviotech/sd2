
const defaults = require('../models/default');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('livroAutor', {
    ...defaults.columns,
    livroId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'livros',
        key: 'id',
      },
      allowNull: false,
    },
    autorId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'autores',
        key: 'id',
      },
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('livroAutor'),
};
