/* global jest, describe, it, expect */

const exercisesController = require('../../src/controllers/exercisesController');
const InexistingId = require('../../src/errors/InexistingId');
const Exercise = require('../../src/models/Exercise');
const Topic = require('../../src/models/Topic');
const ExerciseUser = require('../../src/models/ExerciseUser');

jest.mock('../../src/models/Exercise');
jest.mock('../../src/models/ExerciseUser');
jest.mock('../../src/models/Topic');

describe('postExerciseUser', () => {
  it('should return undefined', async () => {
    Exercise.findByPk.mockResolvedValue({ id: 1 });
    ExerciseUser.findOrCreate.mockResolvedValue([{
      id: 1,
      userId: 2,
      exerciseId: 1,
      destroy: () => {},
    }, null]);
    const result = await exercisesController.postExerciseUser(1, 2);
    expect(result).toBe(undefined);
  });

  it('should throw an error', async () => {
    Exercise.findByPk.mockResolvedValue(null);
    ExerciseUser.findOrCreate.mockResolvedValue({});
    expect(async () => {
      await exercisesController.postExerciseUser(1, 2);
    }).rejects.toThrow(InexistingId);
  });
});

describe('getAllExercises', () => {
  it('should return an array', async () => {
    const expectedArray = [{
      topicId: 1,
      baseCode: 'Base Code',
      testCode: 'Test Code',
      solutionCode: 'Solution Code',
      statement: 'Statement Code',
      position: 2,
    }];
    Exercise.findAll.mockResolvedValue(expectedArray);
    const exercises = await exercisesController.getAllExercises();
    expect(exercises).toEqual(expectedArray);
  });
});

describe('getExerciseByIdAsAdmin', () => {
  it('should return an object', async () => {
    const expectedObject = {
      id: 1,
      topicId: 1,
      baseCode: 'Base Code',
      testCode: 'Test Code',
      solutionCode: 'Solution Code',
      statement: 'Statement Code',
      position: 2,
    };
    Exercise.findByPk.mockResolvedValue(expectedObject);
    const exercise = await exercisesController.getExerciseByIdAsAdmin(expectedObject.id);
    expect(exercise).toEqual(expectedObject);
  });

  it('should throw an error', async () => {
    Exercise.findByPk.mockResolvedValue(null);
    expect(async () => {
      await exercisesController.getExerciseByIdAsAdmin(1);
    }).rejects.toThrow(InexistingId);
  });
});

describe('createExercise', () => {
  it('should return an exercise with id', async () => {
    const exerciseBody = {
      topicId: 1,
      baseCode: 'Base Code',
      testCode: 'Test Code',
      solutionCode: 'Solution Code',
      statement: 'Statement Code',
      position: 2,
    };
    Topic.findByPk.mockResolvedValue(true);
    Exercise.create.mockResolvedValue({ id: 1, ...exerciseBody });
    const exercise = await exercisesController.createExercise(exerciseBody);
    expect(exercise).toEqual({ id: 1, ...exerciseBody });
  });
  it('should throw an error', async () => {
    const exerciseBody = {
      topicId: 1,
      baseCode: 'Base Code',
      testCode: 'Test Code',
      solutionCode: 'Solution Code',
      statement: 'Statement Code',
      position: 2,
    };
    Topic.findByPk.mockResolvedValue(true);
    expect(async () => {
      await exercisesController.createExercise(exerciseBody);
    }).rejects.toThrow(InexistingId);
  });
});

describe('editExercise', () => {
  it('should return an object', async () => {
    const oldExercise = {
      id: 1,
      topicId: 1,
      baseCode: 'Base Code',
      testCode: 'Test Code',
      solutionCode: 'Solution Code',
      statement: 'Statement Code',
      position: 2,
      save: () => {},
    };
    const infoToEdit = {
      baseCode: 'Base Code EDITED',
    };
    Exercise.findByPk.mockResolvedValue(oldExercise);
    const exercise = await exercisesController.editExercise(oldExercise.id, infoToEdit);
    expect(exercise).toEqual(expect.objectContaining({
      id: 1,
      topicId: 1,
      baseCode: infoToEdit.baseCode,
      testCode: 'Test Code',
      solutionCode: 'Solution Code',
      statement: 'Statement Code',
      position: 2,
      save: expect.any(Function),
    }));
  });

  it('should throw an error', async () => {
    Exercise.findByPk.mockResolvedValue(null);
    const infoToEdit = {
      baseCode: 'Base Code EDITED',
    };
    expect(async () => {
      await exercisesController.editExercise(1, infoToEdit);
    }).rejects.toThrow(InexistingId);
  });
});

describe('deleteOneExercise', () => {
  it('should return undefined', async () => {
    const id = 1;
    const exercise = {
      id: 1,
      topicId: 1,
      baseCode: 'Base Code',
      testCode: 'Test Code',
      solutionCode: 'Solution Code',
      statement: 'Statement Code',
      position: 2,
      destroy: () => {},
    };
    Exercise.findByPk.mockResolvedValue(exercise);
    const result = await exercisesController.deleteOneExercise(id);
    expect(result).toEqual(undefined);
  });

  it('should throw an error', async () => {
    Exercise.findByPk.mockResolvedValue(null);
    expect(async () => {
      await exercisesController.deleteOneExercise(1);
    }).rejects.toThrow(InexistingId);
  });
});
