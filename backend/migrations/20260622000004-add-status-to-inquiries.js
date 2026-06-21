'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Inquiries', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'NEW'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Inquiries', 'status');
  }
};
