const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // UNIQUE tanımı burada
  },
}, {
  tableName: 'Roles',
  timestamps: false,
});

module.exports = Role;