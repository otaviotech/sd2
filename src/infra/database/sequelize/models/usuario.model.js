const Sequelize = require('sequelize');
const defaults = require('./default');

class Usuario extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      nome: { type: DataTypes.STRING },
      telefone: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      senha: { type: DataTypes.STRING },
      ...defaults.columns,
    }, {
      ...defaults.configs,
      sequelize,
      modelName: 'usuario',
      tableName: 'usuarios',
      name: {
        singular: 'usuario',
        plural: 'usuarios',
      },
    });
  }

  static associate(models) {
    this.hasMany(models.Emprestimo, {
      // as: 'emprestimos',
      foreignKey: 'usuarioId',
    });
  }
}


module.exports = Usuario;
