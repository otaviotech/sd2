const Sequelize = require('sequelize');
const defaults = require('./default');

class Emprestimo extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      dataInicio: { type: DataTypes.DATE },
      dataFim: { type: DataTypes.DATE },
      dataDevolucao: { type: DataTypes.DATE },
      ...defaults.columns,
    }, {
      ...defaults.configs,
      sequelize,
      modelName: 'emprestimo',
      tableName: 'emprestimos',
      name: {
        singular: 'emprestimo',
        plural: 'emprestimos',
      },
    });
  }

  static associate(models) {
    this.belongsToMany(models.Livro, {
      // as: 'livros',
      through: 'livroEmprestimo',
      foreignKey: 'emprestimoId',
    });

    this.belongsTo(models.Usuario, {
      // as: 'usuario',
      foreignKey: 'usuarioId',
    });
  }
}


module.exports = Emprestimo;
