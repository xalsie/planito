const { v4: uuidv4 } = require("uuid");
const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Event = sequelize.define(
    "event",
    {
        start: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("indisponnible", "occupé", "formation", "disponible", "autre"),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
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

module.exports = Event;
