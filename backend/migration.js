require("dotenv").config();

const sequelize = require("./models/db");

const User = require("./models/user");

const Module = require("./models/module");

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
