const { v4: uuidv4 } = require("uuid");
const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Class = sequelize.define(
  "classes",
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
    school_id: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  },
  {
    hooks: {
      beforeValidate: (classes, options) => {
        classes.id = uuidv4();
      },
    },
  }
);

module.exports = Class;
