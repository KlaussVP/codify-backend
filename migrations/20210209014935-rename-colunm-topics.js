'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('topics', 'courseId', 'chapterId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('topics', 'chapterId', 'courseId');
  }
};
