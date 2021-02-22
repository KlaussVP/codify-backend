const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class ExerciseUser extends Sequelize.Model {}

ExerciseUser.init(
  {
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
  },
  {
    sequelize,
    modelName: 'exerciseUser',
  },
);

module.exports = ExerciseUser;
