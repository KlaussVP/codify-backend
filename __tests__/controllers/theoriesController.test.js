/* global jest, describe, it, expect */

const theoriesController = require('../../src/controllers/theoriesController');
const InexistingId = require('../../src/errors/InexistingId');
const Theory = require('../../src/models/Theory');
const TheoryUser = require('../../src/models/TheoryUser');

jest.mock('../../src/models/Theory');
jest.mock('../../src/models/TheoryUser');

describe('postTheoryUser', () => {
  it('should return undefined', async () => {
    Theory.findByPk.mockResolvedValue({ id: 1 });
    TheoryUser.findOrCreate.mockResolvedValue({});
    const result = await theoriesController.postTheoryUser(1, 2);
    expect(result).toBe(undefined);
  });
  it('should throw an error', async () => {
    Theory.findByPk.mockResolvedValue(null);
    TheoryUser.findOrCreate.mockResolvedValue({});
    expect(async () => {
      await theoriesController.postTheoryUser(1, 2);
    }).rejects.toThrow(InexistingId);
  });
});
