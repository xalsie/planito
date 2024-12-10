const { v4: uuidv4 } = require("uuid");

const { DataTypes } = require("sequelize");

const sequelize = require("./db");

const Module = sequelize.define(
  "module",
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
    volHours: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
    },
    nbClasses: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nbCc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    volExams: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeValidate: (user, options) => {
        user.id = uuidv4();
      },
    },
  }
);

module.exports = Module;
