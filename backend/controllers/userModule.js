const UserModule = require("../models/userModule");

exports.create = async (req, res, next) => {
  try {
    if (!req.body || !req.body.userId || !req.body.settings) {
      const error = new Error("Invalid data");
      error.statusCode = 400;
      next(error);
    }

    const { userId, settings } = req.body;

    console.log("userId", userId);

    const [userModule, created] = await UserModule.findOrCreate({
      where: { user_id: userId, settings: settings },
      defaults: {
        user_id: userId,
        settings: settings,
      },
    });
    console.log("userModule", userModule);

    if (created) {
      res.status(201).json(userModule).end();
      return;
    }
    const error = new Error("UserModule already exists");
    error.statusCode = 409;
    next(error);
  } catch (err) {
    console.error("Error in createUserModule:", err.message);
    const error = new Error("An error occurred while processing the request.");
    error.statusCode = 500;
    next(error);
  }
};

exports.getAllByUserId = async (req, res, next) => {
  try {
    if (!req.params || !req.params.id) {
      const error = new Error("Invalid data");
      error.statusCode = 400;
      throw error;
    }
    const userId = req.params.id;
    const userModule = await UserModule.findAll({ where: { user_id: userId } });
    if (!userModule) {
      const error = new Error("UserModule not found");
      error.statusCode = 404;
      next(error);
    }

    res.status(200).json(userModule).end();
  } catch (err) {
    console.error("Error in getAllUserModule:", err.message);
    const error = new Error("An error occurred while processing the request.");
    error.statusCode = 500;
    next(error);
  }
};

exports.update = async (req, res, next) => {
  if (!req.body || !req.body.settings || req.params || !req.params.userId) {
    const error = new Error("Invalid data");
    error.statusCode = 400;
    next(error);
  }

  const userId = req.params.userId;
  const settings = req.body;
  try {
    const userModule = await UserModule.findByPk(userId);
    if (!userModule) {
      const error = new Error("UserModule not found");
      error.statusCode = 404;
      next(error);
    }
    const newUserModule = await User.update(settings, {
      where: {
        id: userId,
      },
      returning: true,
      plain: true,
    });
    res.sendStatus(200).json(newUserModule).end();
  } catch (err) {
    console.error("Error in updateUser:", err.message);
    const error = new Error("An error occurred while processing the request.");
    error.statusCode = 500;
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  if (!req.params || !req.params.userId) {
    const error = new Error("Invalid data");
    error.statusCode = 400;
    next(error);
  }

  const { userId } = req.params.userId;
  try {
    const userModule = await UserModule.findByPk(userId);
    if (!userModule) {
      const error = new Error("UserModule not found");
      error.statusCode = 404;
      next(error);
    }

    await userModule.destroy();
    res.status(204).end();
  } catch (err) {
    console.error("Error in deleteUserModule:", err.message);
    const error = new Error("An error occurred while processing the request.");
    error.statusCode = 500;
    next(error);
  }
};
