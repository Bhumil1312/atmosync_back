// models/device.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 

const Device = sequelize.define('Device', {
  device_id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false
  },
  device_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  lab_incharge: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
    defaultValue: 'active'
  }
}, {
  tableName: 'devices',
  timestamps: false
});

module.exports = Device;
