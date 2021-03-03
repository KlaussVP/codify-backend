const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Exercise extends Sequelize.Model {}

Exercise.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    topicId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'topics',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    baseCode: {
      type: Sequelize.STRING(100000),
      allowNull: false,
    },
    testCode: {
      type: Sequelize.STRING(100000),
      allowNull: false,
    },
    solutionCode: {
      type: Sequelize.STRING(100000),
      allowNull: false,
    },
    statement: {
      type: Sequelize.STRING(100000),
      allowNull: false,
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'exercise',
  },
);

module.exports = Exercise;
