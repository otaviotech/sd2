const { DataTypes } = require('sequelize');

const configs = {
  timestamps: true,
  version: true,
  paranoid: true,
};

const columns = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  createdAt: {
    type: DataTypes.DATE,
    field: 'createdAt',
  },

  updatedAt: {
    type: DataTypes.DATE,
    field: 'updatedAt',
  },

  deletedAt: {
    type: DataTypes.DATE,
    field: 'deletedAt',
  },

  version: {
    type: DataTypes.INTEGER,
    field: 'version',
    allowNull: false,
    defaultValue: 0,
  },
};

module.exports = {
  configs,
  columns,
};
