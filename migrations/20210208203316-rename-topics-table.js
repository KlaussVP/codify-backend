'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.renameTable('topics', 'chapters');
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.renameTable('chapters', 'topics');
  }
};
