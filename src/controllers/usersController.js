const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ConflictError = require('../errors/ConflictError');
const AuthorizationError = require('../errors/AuthorizationError');
const User = require('../models/User');

class UsersController {
  async findUserByEmail(email) {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  async findUserById(id) {
    const user = await User.findOne({ where: { id } });
    return user;
  }

  async postSignUp({ name, email, password }) {
    const userExists = await this.findUserByEmail(email);
    if (userExists) throw new ConflictError();

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      name, email, password: hashedPassword, type: 'CLIENT',
    });

    return user;
  }

  async postSignIn({ email, password }, type) {
    const user = await this.findUserByEmail(email);

    if (!user) throw new AuthorizationError();

    if (type !== user.type) throw new AuthorizationError();
    const checkPassword = (type === 'CLIENT') 
      ? bcrypt.compareSync(password, user.password)
      : password === user.password;

    if (checkPassword) {
      const { id } = user;
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 86400,
      });
      const userData = {
        token,
        type: user.type,
        name: user.name,
      };
      return userData;
    }
    throw new AuthorizationError();
  }
}

module.exports = new UsersController();
