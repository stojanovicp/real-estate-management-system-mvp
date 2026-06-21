'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Apartments', 'isPricePublic', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('Apartments', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Apartments', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Apartments', 'isPricePublic');
    await queryInterface.removeColumn('Apartments', 'description');
    await queryInterface.removeColumn('Apartments', 'imageUrl');
  }
};
