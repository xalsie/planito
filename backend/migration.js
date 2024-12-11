require("dotenv").config();

const sequelize = require("./models/db");

const User = require('./models/user');
const School = require('./models/school');


const Module = require("./models/module");
const Event = require('./models/event.models');

User.hasMany(Event, { as: 'user_id' });
School.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });

sequelize.sync({ alter: true });
