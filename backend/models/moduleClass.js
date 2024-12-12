const { v4: uuidv4 } = require("uuid");
const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const moduleClass = sequelize.define(
    "moduleClass",
    {
        module_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        class_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
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

module.exports = moduleClass;
