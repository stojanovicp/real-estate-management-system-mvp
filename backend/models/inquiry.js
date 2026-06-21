'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inquiry extends Model {

    static associate(models) {
      Inquiry.belongsTo(models.Apartment, {
        foreignKey: 'apartmentId',
        as: 'apartment'
      });
    }
  }
  Inquiry.init({
    apartmentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NEW'
    }
  }, {
    sequelize,
    modelName: 'Inquiry',
  });
  return Inquiry;
};