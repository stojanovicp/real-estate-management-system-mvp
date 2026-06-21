'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Building extends Model {
    static associate(models) {
      Building.hasMany(models.Apartment, {
        foreignKey: 'buildingId',
        as: 'apartments'
      });
    }
  }
  Building.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    description: DataTypes.TEXT,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    imageUrl: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Building',
  });
  return Building;
};
