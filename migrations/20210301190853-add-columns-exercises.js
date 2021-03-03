
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('exercises', 'baseCode', {
      type: Sequelize.STRING(100000),
      allowNull: false,
    });

    await queryInterface.addColumn('exercises', 'testCode', {
      type: Sequelize.STRING(100000),
      allowNull: false,
    });

    await queryInterface.addColumn('exercises', 'statement', {
      type: Sequelize.STRING(100000),
      allowNull: false,
    });

    await queryInterface.addColumn('exercises', 'solutionCode', {
      type: Sequelize.STRING(100000),
      allowNull: false,
    });

    await queryInterface.addColumn('exercises', 'order', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('exercises', 'baseCode');
    await queryInterface.removeColumn('exercises', 'testCode');
    await queryInterface.removeColumn('exercises', 'statement');
    await queryInterface.removeColumn('exercises', 'solutionCode');
    await queryInterface.removeColumn('exercises', 'order');
  },
};
