require('dotenv').config();
const { Sequelize } = require('sequelize');

const options = { logging: false, dialect: 'postgres' };

if (process.env.NODE_ENV === 'production') {
  options.dialectOptions = { ssl: { rejectUnauthorized: false } };
}

const sequelize = new Sequelize(process.env.DATABASE_URL, options);

module.exports = sequelize;
