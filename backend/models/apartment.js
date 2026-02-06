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
      // define association here
    }
  }
  Apartment.init({
    buildingId: DataTypes.INTEGER,
    number: DataTypes.STRING,
    floor: DataTypes.INTEGER,
    rooms: DataTypes.INTEGER,
    area: DataTypes.FLOAT,
    price: DataTypes.FLOAT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Apartment',
  });
  return Apartment;
};