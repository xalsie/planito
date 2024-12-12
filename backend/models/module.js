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
    nbCc: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    volExams: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 120,
    },
    school_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeValidate: (module, options) => {
        module.id = uuidv4();
      },
    },
  }
);

module.exports = Module;
