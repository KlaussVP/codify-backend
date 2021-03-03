
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('exercises', 'order', 'position');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('exercises', 'position', 'order');
  },
};
