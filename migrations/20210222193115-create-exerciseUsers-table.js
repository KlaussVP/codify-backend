
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('exerciseUsers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      exerciseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exercises',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('exerciseUsers');
  },
};
