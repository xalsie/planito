require('dotenv').config();

const sequelize = require('./models/db');

const User = require('./models/user');


sequelize.sync({ alter: true });