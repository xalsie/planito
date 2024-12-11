const { v4: uuidv4 } = require("uuid");
const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const { tr } = require("@faker-js/faker");
const Room = require("./room");

const Event = sequelize.define(
  "event",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "availability",
        "unavailability",
        "course",
        "exam",
        "holiday"
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    class_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    material_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeValidate: (event, options) => {
        event.id = uuidv4();
      },
    },
  }
);

module.exports = Event;
