const { v4: uuidv4 } = require("uuid");

const { DataTypes } = require("sequelize");

const sequelize = require("./db");

const School = sequelize.define(
  "school",
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    interval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 90,
    },
    opening_hours: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    closing_hours: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  },
  {
    hooks: {
      beforeValidate: (school, options) => {
        school.id = uuidv4();
      },
    }
  }
);

module.exports = School;
