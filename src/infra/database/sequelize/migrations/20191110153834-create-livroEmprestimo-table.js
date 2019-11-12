
const defaults = require('../models/default');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('livroEmprestimo', {
    ...defaults.columns,
    livroId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'livros',
        key: 'id',
      },
      allowNull: false,
    },
    emprestimoId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'emprestimos',
        key: 'id',
      },
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('livroEmprestimo'),
};
