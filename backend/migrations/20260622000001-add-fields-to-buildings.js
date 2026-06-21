'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Buildings', 'city', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });

    await queryInterface.addColumn('Buildings', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Buildings', 'latitude', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('Buildings', 'longitude', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('Buildings', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Buildings', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Buildings', 'city');
    await queryInterface.removeColumn('Buildings', 'description');
    await queryInterface.removeColumn('Buildings', 'latitude');
    await queryInterface.removeColumn('Buildings', 'longitude');
    await queryInterface.removeColumn('Buildings', 'imageUrl');
    await queryInterface.removeColumn('Buildings', 'isActive');
  }
};
