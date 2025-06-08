// models/reading.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 
const Device = require('./device');

const Reading = sequelize.define('Reading', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  device_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
    references: {
      model: Device,
      key: 'device_id'
    }
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  humidity: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'readings',
  timestamps: false
});

// Associations
Reading.belongsTo(Device, { foreignKey: 'device_id', onDelete: 'CASCADE' });
Device.hasMany(Reading, { foreignKey: 'device_id' });

module.exports = Reading;
