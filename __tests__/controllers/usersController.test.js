/* global jest, describe, it, expect */
const jwt = require('jsonwebtoken');
const usersController = require('../../src/controllers/usersController');
const ConflictError = require('../../src/errors/ConflictError');
const AuthorizationError = require('../../src/errors/AuthorizationError');
const User = require('../../src/models/User');
const sessionStore = require('../../src/repositories/sessionStore');

jest.mock('../../src/repositories/sessionStore');

jest.mock('bcrypt', () => ({
  hashSync: (password) => password,
  compareSync: (password) => password,
}));

jest.mock('../../src/models/User');
jest.mock('sequelize');

describe('postSignup', () => {
  it('should return a user with id', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '123456',
    };

    const expectedObject = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      password: '123456',
    };

    jest.spyOn(usersController, 'findUserByEmail').mockImplementationOnce(() => null);
    User.create.mockResolvedValue(expectedObject);

    const user = await usersController.postSignUp(body);

    expect(user).toBe(expectedObject);
  });

  it('should throw a conflict error', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '123456',
    };

    const expectedObject = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      password: '123456',
      type: 'CLIENT',
    };

    jest.spyOn(usersController, 'findUserByEmail').mockImplementationOnce(() => expectedObject);

    expect(async () => usersController.postSignUp(body)).rejects.toThrow(ConflictError);
  });
});

describe('findByEmail', () => {
  it('should return the same object', async () => {
    const email = 'test@test.com';

    const expectedObject = {
      id: 1, email, name: 'test', password: '123456',
    };

    User.findOne.mockResolvedValue(expectedObject);

    const user = await usersController.findUserByEmail(email);
    expect(user).toBe(expectedObject);
  });
});

describe('postSignIn', () => {
  it('should return username and auth token for CLIENT', async () => {
    const jwtSpy = jest.spyOn(jwt, 'sign');
    jwtSpy.mockReturnValue('token');

    const body = {
      email: 'test@test.com',
      password: '123456',
    };

    const expectedObject = {
      id: 1,
      name: 'test',
      type: 'CLIENT',
      token: 'token',
    };

    const userFound = {
      id: 1,
      name: 'test',
      password: '123456',
      type: 'CLIENT',
    };

    jest.spyOn(usersController, 'findUserByEmail').mockImplementationOnce(() => userFound);
    sessionStore.setSession.mockImplementationOnce(() => {});

    const user = await usersController.postSignIn(body, 'CLIENT');
    expect(user).toStrictEqual(expectedObject);
    expect(sessionStore.setSession).toHaveBeenCalledWith('token', {
      id: userFound.id,
      token: 'token',
      type: userFound.type,
      name: userFound.name,
    });
  });

  it('should return username and auth token for ADMIN', async () => {
    const jwtSpy = jest.spyOn(jwt, 'sign');
    jwtSpy.mockReturnValue('token');

    const body = {
      email: 'test@test.com',
      password: '123456',
    };

    const expectedObject = {
      id: 1,
      name: 'test',
      type: 'ADMIN',
      token: 'token',
    };

    const userFound = {
      id: 1,
      name: 'test',
      password: '123456',
      type: 'ADMIN',
    };

    jest.spyOn(usersController, 'findUserByEmail').mockImplementationOnce(() => userFound);
    sessionStore.setSession.mockImplementationOnce(() => {});

    const user = await usersController.postSignIn(body, 'ADMIN');
    expect(user).toStrictEqual(expectedObject);
    expect(sessionStore.setSession).toHaveBeenCalledWith('token', {
      id: userFound.id,
      token: 'token',
      type: userFound.type,
      name: userFound.name,
    });
  });

  it('should throw authorization error when user type differs from endpoint', async () => {
    const jwtSpy = jest.spyOn(jwt, 'sign');
    jwtSpy.mockReturnValue('token');

    const body = {
      email: 'test@test.com',
      password: '123456',
    };
    const userFound = {
      name: 'test',
      password: '123456',
      type: 'CLIENT',
    };

    jest.spyOn(usersController, 'findUserByEmail').mockImplementationOnce(() => userFound);
    sessionStore.setSession.mockImplementationOnce(() => {});

    expect(async () => usersController.postSignIn(body, 'ADMIN')).rejects.toThrow(AuthorizationError);
  });

  it('should throw authorization error when password is wrong ADMIN', async () => {
    const jwtSpy = jest.spyOn(jwt, 'sign');
    jwtSpy.mockReturnValue('token');

    const body = {
      email: 'test@test.com',
      password: 'ZZZZZZZ',
    };

    const userFound = {
      name: 'test',
      password: '123456',
      type: 'ADMIN',
    };

    jest.spyOn(usersController, 'findUserByEmail').mockImplementationOnce(() => userFound);
    sessionStore.setSession.mockImplementationOnce(() => {});

    expect(async () => usersController.postSignIn(body, 'ADMIN')).rejects.toThrow(AuthorizationError);
  });

  it('should throw authorization error when password is wrong CLIENT', async () => {
    const jwtSpy = jest.spyOn(jwt, 'sign');
    jwtSpy.mockReturnValue('token');

    const body = {
      email: 'test@test.com',
      password: '123456',
    };

    const userFound = {
      name: 'test',
      password: '123456',
      type: 'CLIENT',
    };

    jest.spyOn(usersController, 'findUserByEmail').mockImplementationOnce(() => userFound);
    sessionStore.setSession.mockImplementationOnce(() => {});

    expect(async () => usersController.postSignIn(body, 'CLIENT')).rejects.toThrow(AuthorizationError);
  });
});

describe('postSignOut', () => {
  it('should call the delete function from sessionStore', async () => {
    const token = 'tokenJWT';
    sessionStore.deleteSession.mockImplementationOnce(() => {});

    await usersController.postSignOut(token);

    expect(sessionStore.deleteSession).toHaveBeenCalledWith(token);
  });
});

