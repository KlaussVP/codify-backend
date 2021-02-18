const Course = require('../models/Course');
const CourseUser = require('../models/CourseUser');
const User = require('../models/User');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Theory = require('../models/Theory');

Course.belongsToMany(User, { through: CourseUser });
User.belongsToMany(Course, { through: CourseUser });
Course.hasMany(Chapter);
Chapter.hasMany(Topic, { onDelete: 'CASCADE' });
Topic.belongsTo(Chapter, { onDelete: 'CASCADE'});
Topic.hasMany(Theory, { onDelete: 'CASCADE' });
Theory.belongsTo(Topic, { onDelete: 'CASCADE' });