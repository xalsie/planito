const { v4: uuidv4 } = require("uuid");

const { DataTypes } = require("sequelize");

const sequelize = require("./db");
const User = require("./user");

const UserSchool = sequelize.define(
  "userSchool",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    school_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeValidate: (userSchool, options) => {
        userSchool.id = uuidv4();
      },
    },
  }
);

module.exports = UserSchool;
