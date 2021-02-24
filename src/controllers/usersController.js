const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const sessionStore = require('../repositories/sessionStore');

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
        id,
        token,
        type: user.type,
        name: user.name,
      };
      await sessionStore.setSession(token, userData);
      return userData;
    }
    throw new AuthorizationError();
  }

  async postSignOut(token) {
    await sessionStore.deleteSession(token);
  }

  async sendEmailWithToken(email) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new AuthorizationError();

    const token = uuid.v4();
    await sessionStore.setSession(token, user.id);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
      to: email,
      from: process.env.EMAIL_CODIFY,
      subject: 'Link para recuperar sua senha',
      html: `http://localhost:9000/recover-password/${token}`,
    };

    sgMail.send(message).then(() => {
      console.log('Email sent');
    }).catch((error) => {
      console.error(error);
    });
    return token;
  }
}

module.exports = new UsersController();
