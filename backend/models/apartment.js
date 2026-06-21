'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Apartment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Apartment.belongsTo(models.Building, {
        foreignKey: 'buildingId',
        as: 'building'
      });

      Apartment.hasMany(models.Inquiry, {
        foreignKey: 'apartmentId',
        as: 'inquiries'
      });

      Apartment.hasMany(models.Reservation, {
        foreignKey: 'apartmentId',
        as: 'reservations'
      });
    }
  }
  Apartment.init({
    buildingId: DataTypes.INTEGER,
    number: DataTypes.STRING,
    floor: DataTypes.INTEGER,
    rooms: DataTypes.INTEGER,
    area: DataTypes.FLOAT,
    price: DataTypes.FLOAT,
    status: DataTypes.STRING,
    isPricePublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Apartment',
  });
  return Apartment;
};