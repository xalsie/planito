require("dotenv").config();

const sequelize = require("./models/db");

const User = require("./models/user");
const School = require("./models/school");
const Module = require("./models/module");
const Class = require("./models/class");
const Room = require("./models/room");
const Material = require("./models/material");
const Event = require("./models/event");
const UserModule = require("./models/userModule");
const ModuleClass = require("./models/moduleClass");
const UserSchool = require("./models/userSchool");

School.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

Room.belongsTo(School, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});

Material.belongsTo(School, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});

Event.belongsTo(Room, {
    foreignKey: "room_id",
    onDelete: "CASCADE",
});

Event.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

Event.belongsTo(Module, {
    foreignKey: "module_id",
    onDelete: "CASCADE",
});

Event.belongsTo(Material, {
    foreignKey: "material_id",
    onDelete: "CASCADE",
});

Class.hasMany(Event, {
    foreignKey: "class_id",
    onDelete: "CASCADE",
});


Event.belongsTo(Class, {
    foreignKey: "class_id",
    onDelete: "CASCADE",
});

// Event.belongsTo(UserSchool, {
//     foreignKey: "user_id",
//     onDelete: "CASCADE",
// });

// UserSchool.hasMany(Event, {
//     foreignKey: "user_id",
//     onDelete: "CASCADE",
// });

// UserSchool.belongsTo(School, {
//     foreignKey: "school_id",
//     onDelete: "CASCADE",
// });

User.hasMany(UserModule, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

UserModule.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

UserModule.belongsTo(Module, {
    foreignKey: "module_id",
    onDelete: "CASCADE",
});

ModuleClass.belongsTo(Module, {
    foreignKey: "module_id",
    onDelete: "CASCADE",
});

ModuleClass.belongsTo(Class, {
    foreignKey: "class_id",
    onDelete: "CASCADE",
});

User.hasMany(ModuleClass, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

ModuleClass.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

User.hasMany(UserSchool, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

UserSchool.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

UserSchool.belongsTo(School, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});

Module.belongsTo(School, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});

Class.belongsTo(School, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});

Class.belongsTo(Module, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});

Class.hasMany(ModuleClass, {
    foreignKey: "class_id",
    onDelete: "CASCADE",
});

Module.hasMany(Class, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});

School.hasMany(UserSchool, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});

UserSchool.belongsTo(UserModule, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

UserSchool.belongsTo(Class, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});

Class.hasMany(UserSchool, {
    foreignKey: "school_id",
    onDelete: "CASCADE",
});

module.exports = {
    User,
    UserSchool,
    School,
    Room,
    Material,
    Event,
    Module,
    Class,
    UserModule,
    ModuleClass
};