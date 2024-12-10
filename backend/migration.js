require("dotenv").config();

const sequelize = require("./models/db");

const User = require("./models/user");

const Module = require("./models/module");

sequelize.sync({ alter: true });
