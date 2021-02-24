/* global jest, describe, it, expect */

const exercisesController = require('../../src/controllers/exercisesController');
const InexistingId = require('../../src/errors/InexistingId');
const Exercise = require('../../src/models/Exercise');
const ExerciseUser = require('../../src/models/ExerciseUser');

jest.mock('../../src/models/Exercise');
jest.mock('../../src/models/ExerciseUser');

describe('postExerciseUser', () => {
  it('should return undefined', async () => {
    Exercise.findByPk.mockResolvedValue({ id: 1 });
    ExerciseUser.findOrCreate.mockResolvedValue({});
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
