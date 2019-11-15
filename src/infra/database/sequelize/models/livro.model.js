const Sequelize = require('sequelize');
const defaults = require('./default');

class Livro extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      titulo: { type: DataTypes.STRING },
      quantidade: { type: DataTypes.INTEGER },
      foto: { type: DataTypes.STRING },
      ...defaults.columns,
    }, {
      ...defaults.configs,
      sequelize,
      modelName: 'livro',
      tableName: 'livros',
      name: {
        singular: 'livro',
        plural: 'livros',
      },
    });
  }

  static associate(models) {
    this.belongsToMany(models.Autor, {
      // as: 'autores',
      through: 'livroAutor',
      foreignKey: 'livroId',
    });

    this.belongsToMany(models.Emprestimo, {
      // as: 'emprestimos',
      through: 'livroEmprestimo',
      foreignKey: 'livroId',
    });
  }
}

module.exports = Livro;
