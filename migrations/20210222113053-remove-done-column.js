
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('theories', 'done');
    await queryInterface.removeColumn('exercises', 'done');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('theories', 'done', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.addColumn('exercises', 'done', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
};
