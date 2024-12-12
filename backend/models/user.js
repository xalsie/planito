const { v4: uuidv4 } = require("uuid");

const { DataTypes } = require("sequelize");

const sequelize = require("./db");
const UserSchool = require("./userSchool");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
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



module.exports = User;
