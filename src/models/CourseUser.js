const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class CourseUser extends Sequelize.Model { }

CourseUser.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    courseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lastAccessed: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize,
    modelName: 'courseUser',
  },
);

module.exports = CourseUser;
