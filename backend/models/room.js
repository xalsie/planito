const { v4: uuidv4 } = require("uuid");
const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Room = sequelize.define(
  "room",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeValidate: (room, options) => {
        room.id = uuidv4();
      },
    },
  }
);

module.exports = Room;
