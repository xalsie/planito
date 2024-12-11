require("dotenv").config();

const sequelize = require("./models/db");

const User = require("./models/user");
const School = require("./models/school");
const Module = require("./models/module");
const Event = require('./models/event');
const Class = require('./models/class');

const Module = require("./models/module");
const Event = require("./models/event");

User.hasMany(Event, { as: "user_id" });
School.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

const Room = require("./models/room");

const Material = require("./models/material");
const UserModule = require("./models/userModule");

Room.belongsTo(User, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});
User.hasMany(Room, {
    foreignKey: "school_id",
});

Material.belongsTo(User, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});
User.hasMany(Material, {
    foreignKey: "school_id",
});

UserModule.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});
User.hasMany(UserModule, {
    foreignKey: "user_id",
});

UserModule.belongsTo(Module, {
    foreignKey: "module_id",
    onDelete: "CASCADE",
});
Module.hasMany(UserModule, {
    foreignKey: "module_id",
});

sequelize.sync({ alter: true });
