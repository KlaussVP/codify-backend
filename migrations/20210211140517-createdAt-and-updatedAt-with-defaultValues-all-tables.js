'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });

    await queryInterface.changeColumn('users', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });

    await queryInterface.changeColumn('courseUsers', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });

    await queryInterface.changeColumn('courseUsers', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });
    
    await queryInterface.changeColumn('chapters', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });

    await queryInterface.changeColumn('chapters', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'createdAt', {
      type: Sequelize.DATE
    });

    await queryInterface.changeColumn('users', 'updatedAt', {
      type: Sequelize.DATE
    });

    await queryInterface.changeColumn('courseUsers', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false
    });

    await queryInterface.changeColumn('courseUsers', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false
    });

    await queryInterface.changeColumn('chapters', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false
    });

    await queryInterface.changeColumn('chapters', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false
    });
  }
};
