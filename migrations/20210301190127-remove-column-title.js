
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('exercises', 'title');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('exercises', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
