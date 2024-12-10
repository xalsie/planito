const { v4: uuidv4 } = require("uuid");

const { DataTypes } = require("sequelize");

const sequelize = require("./db");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: ["ROLE_USER"],
    },
    newsletter: {
      type: DataTypes.BOOLEAN,
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
