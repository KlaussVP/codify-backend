const { Sequelize } = require("sequelize");
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
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'courseUser',
    }
);

module.exports = CourseUser;