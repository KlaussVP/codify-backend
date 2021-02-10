'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('courseUsers', 'lastAccessed', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('courseUsers', 'lastAccessed')
  }
};
