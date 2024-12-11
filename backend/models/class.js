const { v4: uuidv4 } = require("uuid");
const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Class = sequelize.define(
    "class",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        hooks: {
            beforeValidate: (user, options) => {
                user.id = uuidv4();
            },
        },
    }
);

module.exports = Class;
