require("dotenv").config();

const sequelize = require("./models/db");

const User = require('./models/user');
const Module = require("./models/module");
const Event = require('./models/event.models');

User.hasMany(Event, { as: 'user_id' });

sequelize.sync({ alter: true });
