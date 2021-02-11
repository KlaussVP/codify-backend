'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('topics', 'chapterId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'chapters',
          key: 'id',
        },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.changeColumn('topics', 'chapterId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'chapters',
        key: 'id',
      },
    })]);
  },
};