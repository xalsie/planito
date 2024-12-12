const Module = require("../models/module");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const UserSchool = require("../models/userSchool");
const UserModule = require("../models/userModule");

exports.create = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, roles } = req.body;
    const hashedPw = await bcrypt.hash(password, 12);
    await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPw,
      roles: roles,
    });
    res.sendStatus(201);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.find = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("Could not find user.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.update(req.body, {
      where: {
        id: userId,
      },
      returning: true,
    });
    res.sendStatus(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("Could not find user.");
      error.statusCode = 404;
      throw error;
    }
    await user.destroy();
    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findIntervenantBySchool = async (req, res, next) => {
  try {
    const schoolId = req.params.schoolId;

    const users = await UserSchool.findAll({
      where: {
        school_id: schoolId,
      },
      include: [
        {
          model: User,
          attributes: ["lastName", "firstName", "email", "roles"],
          where: {
            roles: {
              [Op.contains]: ["ROLE_INTERVENANT"],
            },
          },
          include: [
            {
              model: UserModule,
              include: [
                {
                  model: Module,
                  attributes: ["name"],
                },
              ],
              attributes: ["module_id"],
            },
          ],
        },
      ],
    });

    const formattedUsers = users.map((userSchool) => {
      const user = userSchool.user;

      const modules = user.userModules?.map((userModule) => userModule.module.name).join(", ") || "";

      return {
        lastname: user.lastName,
        firstname: user.firstName,
        email: user.email,
        roles: user.roles,
        modules: modules,
      };
    });
    res.status(200).json(formattedUsers);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
