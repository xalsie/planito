const { v4: uuidv4 } = require("uuid");

const { DataTypes } = require("sequelize");

const sequelize = require("./db");

const UserModule = sequelize.define(
  "userModule",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    settings: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeValidate: (userModule, options) => {
        userModule.id = uuidv4();
      },
    },
  }
);

module.exports = UserModule;
