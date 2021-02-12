'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('topics', 'chapters');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('chapters', 'topics');
  }
};
