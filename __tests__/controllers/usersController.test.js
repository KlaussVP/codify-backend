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

jest.mock('uuid', () => ({
  v4: () => 'meu_token_uuid',
}));

jest.mock('@sendgrid/mail', () => ({
  setApiKey: () => {},
  send: async (message) => message,
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
      email: 'teste@gmail.com',
    };

    const userFound = {
      id: 1,
      name: 'test',
      password: '123456',
      type: 'CLIENT',
      email: 'teste@gmail.com',
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
      email: userFound.email,
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
      email: 'teste@gmail.com',
    };

    const userFound = {
      id: 1,
      name: 'test',
      password: '123456',
      type: 'ADMIN',
      email: 'teste@gmail.com',
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
      email: userFound.email,
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

describe('sendEmailWithToken', () => {
  it('should call the expected functions', async () => {
    const ObjectFunctionParameter = {
      email: 'lg@gmail.com',
    };

    const messageExpected = {
      to: ObjectFunctionParameter.email,
      from: process.env.EMAIL_CODIFY,
      subject: 'Link para recuperar sua senha',
      html: 'http://localhost:9000/recover-password/meu_token_uuid',
    };

    const userFound = {
      id: 1,
      name: 'test',
      password: '123456',
      type: 'CLIENT',
    };

    jest.spyOn(usersController, 'findUserByEmail').mockImplementationOnce(() => userFound);
    sessionStore.setSession.mockResolvedValue({});

    const message = await usersController.sendEmailWithToken(ObjectFunctionParameter.email);

    expect(message).toEqual(
      expect.objectContaining(messageExpected),
    );
    expect(sessionStore.setSession).toHaveBeenCalledWith('meu_token_uuid', userFound.id);
  });
  it('should throw an Authorization error, because there is no user with this email', async () => {
    const ObjectFunctionParameter = {
      email: 'lg@gmail.com',
    };

    jest.spyOn(usersController, 'findUserByEmail').mockResolvedValue(null);

    expect(async () => {
      await usersController.sendEmailWithToken(ObjectFunctionParameter.email);
    }).rejects.toThrow(AuthorizationError);
  });
});

describe('editUserPassword', () => {
  it('should return user with the changing password and call the expected functions', async () => {
    const ObjectFunctionParameter = {
      token: 'meu-token-chave-Redis',
      password: 'new-password',
    };
    const userId = 1;

    const userFound = {
      id: userId,
      name: 'test',
      password: '123456',
      type: 'CLIENT',
      save: () => {},
    };
    const expectedObject = {
      id: userId,
      name: 'test',
      password: ObjectFunctionParameter.password,
      type: 'CLIENT',
    };

    sessionStore.getSession.mockResolvedValue(userId);
    jest.spyOn(usersController, 'findUserById').mockImplementationOnce(() => userFound);

    const user = await usersController.editUserPassword(ObjectFunctionParameter);

    expect(user).toEqual(
      expect.objectContaining(expectedObject),
    );
    expect(sessionStore.getSession).toHaveBeenCalledWith(ObjectFunctionParameter.token);
    expect(usersController.findUserById).toHaveBeenCalledWith(userId);
  });
  it('should throw an Authorization error, because there is no register in Redis', async () => {
    const ObjectFunctionParameter = {
      token: 'meu-token-chave-Redis',
      password: 'new-password',
    };

    sessionStore.getSession.mockResolvedValue(false);

    expect(sessionStore.getSession).toHaveBeenCalledWith(ObjectFunctionParameter.token);

    expect(async () => {
      await usersController.editUserPassword(ObjectFunctionParameter);
    }).rejects.toThrow(AuthorizationError);
  });
});

describe('editUserData', () => {
  it('should return user with the changing fields', async () => {
    const ObjectFunctionParameter = {
      email: 'lg@gmail.com',
      name: 'Teste nome',
    };
    const userId = 1;

    const userFound = {
      id: userId,
      name: 'test',
      password: '123456',
      type: 'CLIENT',
      save: () => {},
    };
    const expectedObject = {
      id: userId,
      name: ObjectFunctionParameter.name,
      password: '123456',
      email: ObjectFunctionParameter.email,
      type: 'CLIENT',
    };

    jest.spyOn(usersController, 'findUserById').mockImplementationOnce(() => userFound);

    const user = await usersController.editUserData(userId, ObjectFunctionParameter);

    expect(user).toEqual(
      expect.objectContaining(expectedObject),
    );
    expect(usersController.findUserById).toHaveBeenCalledWith(userId);
  });
  it('should return user with the changing fields - password and name', async () => {
    const ObjectFunctionParameter = {
      password: 'new-password',
      name: 'Teste nome',
    };
    const userId = 1;

    const userFound = {
      id: userId,
      name: 'test',
      password: '123456',
      type: 'CLIENT',
      email: 'lg@gmail.com',
      save: () => {},
    };
    const expectedObject = {
      id: userId,
      name: ObjectFunctionParameter.name,
      email: userFound.email,
      password: ObjectFunctionParameter.password,
      type: 'CLIENT',
    };

    jest.spyOn(usersController, 'findUserById').mockImplementationOnce(() => userFound);

    const user = await usersController.editUserData(userId, ObjectFunctionParameter);

    expect(user).toEqual(
      expect.objectContaining(expectedObject),
    );
    expect(usersController.findUserById).toHaveBeenCalledWith(userId);
  });
  it('should throw an Authorization error, because there is no user with this Id', async () => {
    const ObjectFunctionParameter = {
      email: 'lg@gmail.com',
      name: 'Teste nome',
    };

    jest.spyOn(usersController, 'findUserById').mockImplementationOnce(() => null);

    expect(async () => {
      await usersController.editUserData(ObjectFunctionParameter);
    }).rejects.toThrow(AuthorizationError);
  });
});

