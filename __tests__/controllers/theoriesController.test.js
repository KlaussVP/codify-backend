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
    TheoryUser.findOrCreate.mockResolvedValue([{
      id: 1,
      userId: 2,
      theoryId: 1,
      destroy: () => {},
    }, null]);
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

describe('getAllTheories', () => {
  it('should return an array', async () => {
    const expectedArray = [{ id: 1, youtubeLink: 'https://www.youtube.com/watch?v=08X9gf3mdKY' }];
    Theory.findAll.mockResolvedValue(expectedArray);
    const theories = await theoriesController.getAllTheories();
    expect(theories.length).toBe(1);
    expect(theories).toEqual(expectedArray);
  });
});

describe('getTheoryByIdAsAdmin', () => {
  it('should return an object', async () => {
    const id = 1;
    const youtubeLink = 'https://www.youtube.com/watch?v=08X9gf3mdKY';
    const expectedObject = { id, youtubeLink };
    Theory.findByPk.mockResolvedValue(expectedObject);
    const theory = await theoriesController.getTheoryByIdAsAdmin(id);
    expect(theory).toEqual(expectedObject);
  });

  it('should throw an error', async () => {
    Theory.findByPk.mockResolvedValue(null);
    expect(async () => {
      await theoriesController.getTheoryByIdAsAdmin(-1);
    }).rejects.toThrow(InexistingId);
  });
});

describe('editTheory', () => {
  it('should return an object', async () => {
    const oldTheoryMocked = {
      id: 1,
      youtubeLink: 'https://www.youtube.com/watch?v=08X9gf3mdKY',
      save: () => {},
    };
    const expectedObject = {
      id: oldTheoryMocked.id,
      youtubeLink: 'https://www.youtube.com/watch?v=nQ1XX0GrBEs',
    };

    Theory.findByPk.mockResolvedValue(oldTheoryMocked);
    const theory = await theoriesController
      .editTheory(oldTheoryMocked.id, expectedObject.youtubeLink);
    expect(theory).toEqual(expect.objectContaining({
      id: expectedObject.id,
      youtubeLink: expectedObject.youtubeLink,
      save: expect.any(Function),
    }));
  });

  it('should throw an error', async () => {
    Theory.findByPk.mockResolvedValue(null);
    expect(async () => {
      await theoriesController.editTheory(-1, 'https://www.youtube.com/watch?v=nQ1XX0GrBEs');
    }).rejects.toThrow(InexistingId);
  });
});
