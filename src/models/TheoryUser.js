const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class TheoryUser extends Sequelize.Model {}

TheoryUser.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    theoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'theories',
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
    modelName: 'theoryUser',
  },
);

module.exports = TheoryUser;
