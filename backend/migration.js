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

const Room = require('./models/room');

const Material = require('./models/material');

Room.belongsTo(User, {
    foreignKey: 'school_id',
    onDelete: 'CASCADE'
  });
  User.hasMany(Room, {
    foreignKey: 'school_id'
  });
  
  Material.belongsTo(User, {
    foreignKey: 'school_id',
    onDelete: 'CASCADE'
  });
  User.hasMany(Material, {
    foreignKey: 'school_id'
  });

sequelize.sync({ alter: true });
