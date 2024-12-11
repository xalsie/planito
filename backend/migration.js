require('dotenv').config();

const sequelize = require('./models/db');

const User = require('./models/user');
const School = require('./models/school');




sequelize.sync({ alter: true });