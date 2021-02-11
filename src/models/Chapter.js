const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Chapter extends Sequelize.Model {}

Chapter.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    courseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'chapter',
  },
);

module.exports = Chapter;
