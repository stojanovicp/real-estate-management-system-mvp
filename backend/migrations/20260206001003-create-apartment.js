'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Apartments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buildingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Buildings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      number: {
        type: Sequelize.STRING
      },
      floor: {
        type: Sequelize.INTEGER
      },
      rooms: {
        type: Sequelize.INTEGER
      },
      area: {
        type: Sequelize.FLOAT
      },
      price: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Apartments');
  }
};