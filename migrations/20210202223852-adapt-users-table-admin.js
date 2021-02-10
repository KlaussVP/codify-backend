module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users','type', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'type');
  }
};
