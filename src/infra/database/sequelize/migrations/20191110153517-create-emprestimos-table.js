const defaults = require('../models/default');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('emprestimos', {
    ...defaults.columns,
    usuarioId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    dataInicio: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    dataFim: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    dataDevolucao: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('emprestimos'),
};
