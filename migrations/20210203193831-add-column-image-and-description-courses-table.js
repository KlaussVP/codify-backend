'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('courses', 'image', {
      type: Sequelize.STRING(10000),
      allowNull: false
    });

    await queryInterface.addColumn('courses', 'description', {
      type: Sequelize.STRING(10000),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('courses', 'image'),
    await queryInterface.removeColumn('courses', 'description')
  }
};
