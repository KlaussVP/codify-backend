const Course = require('../models/Course');
const CourseUser = require('../models/CourseUser');
const User = require('../models/User');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Theory = require('../models/Theory');
const Exercise = require('../models/Exercise');

Course.belongsToMany(User, { through: CourseUser });
User.belongsToMany(Course, { through: CourseUser });
Course.hasMany(Chapter);
Chapter.hasMany(Topic, { onDelete: 'CASCADE' });
Topic.belongsTo(Chapter, { onDelete: 'CASCADE' });
Topic.hasOne(Theory, { onDelete: 'CASCADE' });
Theory.belongsTo(Topic, { onDelete: 'CASCADE' });
Topic.hasMany(Exercise, { onDelete: 'CASCADE' });
Exercise.belongsTo(Topic, { onDelete: 'CASCADE' });
