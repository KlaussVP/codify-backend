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
    title: {
      type: Sequelize.STRING,
      allowNull: false,
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
    done: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'exercise',
  },
);

module.exports = Exercise;
