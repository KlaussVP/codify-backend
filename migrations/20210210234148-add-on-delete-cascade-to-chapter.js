'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('chapters', 'courseId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'courses',
          key: 'id',
        },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.changeColumn('chapters', 'courseId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
    })]);
  },
};