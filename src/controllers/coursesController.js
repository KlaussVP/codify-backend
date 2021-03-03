const Course = require('../models/Course');
const ConflictError = require('../errors/ConflictError');
const InexistingId = require('../errors/InexistingId');
const NoCourseStarted = require('../errors/NoCourseStarted');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const CourseUser = require('../models/CourseUser');
const Theory = require('../models/Theory');
const Exercise = require('../models/Exercise');
const TheoryUser = require('../models/TheoryUser');
const ExerciseUser = require('../models/ExerciseUser');

class CoursesController {
  async findCourseByName(name) {
    const course = await Course.findOne({ where: { name } });
    return course;
  }

  async createAsAdmin({
    name, image, description,
  }) {
    const coursesExists = await this.findCourseByName(name);
    if (coursesExists) throw new ConflictError();

    const course = await Course.create({ name, image, description });
    return course;
  }

  async editAsAdmin({
    id, name, image, description,
  }) {
    const course = await this.getCourseById(id);
    if (!course) throw new InexistingId();

    const coursesExists = await this.findCourseByName(name);
    if (coursesExists) throw new ConflictError();

    course.name = name || course.name;
    course.image = image || course.image;
    course.description = description || course.description;

    await course.save();
    return course;
  }

  async deleteCourse(id) {
    const course = await this.getCourseById(id);
    if (!course) throw new InexistingId();

    course.deleted = true;
    await course.save();
    return course;
  }

  async listAllCourses() {
    const courses = await Course.findAll();
    const coursesNotDeleted = courses.filter((c) => c.deleted === false);
    return coursesNotDeleted;
  }

  async listAllCoursesAsAdmin() {
    const courses = await Course.findAll({
      include: [{
        model: Chapter,
        attributes: ['id'],
      }],
    });
    const coursesNotDeleted = courses.filter((c) => c.deleted === false);

    const coursesArrayAdminFormat = [];

    coursesNotDeleted.forEach((course) => {
      const chaptersIds = course.chapters.map((c) => c.id);
      const courseObjectToAdmin = {
        id: course.id,
        name: course.name,
        deleted: JSON.stringify(course.deleted),
        image: course.image,
        description: course.description,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        chapters: chaptersIds,
      };
      coursesArrayAdminFormat.push(courseObjectToAdmin);
    });

    return coursesArrayAdminFormat;
  }

  async getCourseById(id) {
    const course = await Course.findByPk(id);

    if (!course) throw new InexistingId();

    return course;
  }

  async getCourseByIdComplete(id, userId) {
    const course = await Course.findOne({
      where: { id },
      attributes: ['id', 'name', 'image', 'description'],
      include: [{
        model: Chapter,
        attributes: ['id', 'name'],
        include: {
          model: Topic,
          attributes: ['id', 'name'],
          include: [{
            model: Theory,
            include: {
              model: TheoryUser,
              where: {
                userId,
              },
              required: false,
            },
            attributes: ['id', 'youtubeLink'],
          }, {
            model: Exercise,
            include: {
              model: ExerciseUser,
              where: {
                userId,
              },
              required: false,
            },
            attributes: ['id', 'statement', 'baseCode', 'testCode', 'solutionCode', 'position'],
          }],
        },
      }],
      order: [
        [Chapter, 'id', 'ASC'],
        [Chapter, Topic, 'id', 'ASC'],
        [Chapter, Topic, Theory, 'id', 'ASC'],
        [Chapter, Topic, Exercise, 'position', 'ASC'],
      ],
    });
    if (!course) throw new InexistingId();

    return course;
  }

  async getCourseWithNumberActivities(id, userId) {
    const course = await Course.findOne({
      where: { id },
      attributes: ['id', 'name', 'image', 'description'],
      include: [{
        model: Chapter,
        attributes: ['id', 'name'],
        include: [{
          model: Topic,
          attributes: ['id', 'name'],
          include: [{
            model: Theory,
            attributes: ['id'],
          }],
        }],
        order: [
          [Chapter, 'id', 'ASC'],
        ],
      }],
    });
    if (!course) throw new InexistingId();

    const courseWithProgress = await this.getCourseProgress(course, userId);

    return courseWithProgress;
  }

  async startOrContinueCourse(courseId, userId) {
    // eslint-disable-next-line no-unused-vars
    const [startedCourse, created] = await CourseUser.findOrCreate({
      where: {
        courseId,
        userId,
      },
    });

    if (!created) {
      await CourseUser.update({ lastAccessed: new Date() }, {
        where: {
          courseId,
          userId,
        },
      });
    }

    const ids = await this.getIdsToStartACourse(courseId);
    return ids;
  }

  async getCourseByIdAsAdmin(id) {
    const course = await Course.findOne({
      where: { id },
      include: [{
        model: Chapter,
        attributes: ['id', 'name'],
      }],
    });
    if (!course) throw new InexistingId();

    const chaptersIds = course.chapters.map((c) => c.id);

    const courseObjectToAdmin = {
      id: course.id,
      name: course.name,
      deleted: course.deleted,
      image: course.image,
      description: course.description,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      chapters: chaptersIds,
    };
    return courseObjectToAdmin;
  }

  async listStartedCourses(userId) {
    const onGoingCourses = await Course.findAll({
      include: [
        {
          model: CourseUser,
          where: {
            userId,
            deleted: false,
          },
        },
      ],
    });

    if (onGoingCourses.length === 0) throw new NoCourseStarted();

    return onGoingCourses;
  }

  async getLastAccessedCourse(userId) {
    const lastAccessed = await CourseUser.findOne({
      where: { userId, deleted: false },
      order: [['lastAccessed', 'DESC']],
    });

    if (!lastAccessed) throw new NoCourseStarted();

    const lastCourse = await Course.findByPk(lastAccessed.courseId);

    return lastCourse;
  }

  async getIdsToStartACourse(courseId) {
    const chapter = await Chapter.findOne({
      where: {
        courseId,
      },
      order: [['id', 'ASC']],
    });

    if (!chapter) throw new InexistingId();

    const topic = await Topic.findOne({
      where: {
        chapterId: chapter.id,
      },
      order: [['id', 'ASC']],
    });

    if (!topic) throw new InexistingId();

    const theory = await Theory.findOne({
      where: {
        topicId: topic.id,
      },
      order: [['id', 'ASC']],
    });

    if (!theory) throw new InexistingId();

    return {
      courseId, chapterId: chapter.id, topicId: topic.id, theoryId: theory.id,
    };
  }

  async getCourseProgress(course, userId) {
    let totalActivitiesCourse = 0;
    let totalActivitiesCourseDone = 0;
    const newChapters = [];
    const startedCourse = await CourseUser.findAll({
      where: {
        courseId: course.id,
        userId,
      },
    });
    const courseToSend = {
      id: course.id,
      name: course.name,
      description: course.description,
      image: course.image,
      started: startedCourse.length > 0,
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const chapter of course.chapters) {
      const newChapter = {
        id: chapter.id,
        name: chapter.name,
        topics: [],
        theoryCount: 0,
        exerciseCount: 0,
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const topic of chapter.topics) {
        const newTopic = {
          id: topic.id,
          name: topic.name,
          theoryId: topic.theory ? topic.theory.id : 0,
        };
        const exercises = await Exercise.findAll({
          where: {
            topicId: topic.id,
          },
        });
        const theories = await Theory.findAll({
          where: {
            topicId: topic.id,
          },
        });
        const doneExercises = await ExerciseUser.count({
          where: {
            exerciseId: exercises.map((e) => e.id),
            userId,
          },
        });
        const doneTheories = await TheoryUser.count({
          where: {
            theoryId: theories.map((t) => t.id),
            userId,
          },
        });
        newChapter.theoryCount += theories.length;
        newChapter.exerciseCount += exercises.length;
        const totalActivities = exercises.length + theories.length;
        const totalDoneActivities = doneExercises + doneTheories;
        if (totalActivities === totalDoneActivities) {
          newTopic.done = true;
        } else {
          newTopic.done = false;
        }
        totalActivitiesCourse += totalActivities;
        totalActivitiesCourseDone += totalDoneActivities;
        newChapter.topics.push(newTopic);
      }
      newChapters.push(newChapter);
    }
    courseToSend.progress = Math.floor((totalActivitiesCourseDone / totalActivitiesCourse) * 100);
    courseToSend.chapters = newChapters;
    return courseToSend;
  }
}

module.exports = new CoursesController();
