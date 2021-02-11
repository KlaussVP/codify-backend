'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.renameColumn('topics', 'courseId', 'chapterId');
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.renameColumn('topics', 'chapterId', 'courseId');
  }
};
