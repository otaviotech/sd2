const Sequelize = require('sequelize');
const defaults = require('./default');

class Autor extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      nome: { type: DataTypes.STRING },
      ...defaults.columns,
    }, {
      ...defaults.configs,
      sequelize,
      modelName: 'autor',
      tableName: 'autores',
      name: {
        singular: 'autor',
        plural: 'autores',
      },
    });
  }

  static associate(models) {
    this.belongsToMany(models.Livro, {
      // as: 'livros',
      through: 'livroAutor',
      foreignKey: 'autorId',
    });
  }
}

module.exports = Autor;
