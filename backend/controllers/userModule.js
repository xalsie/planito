const UserModule = require("../models/userModule");

exports.create = async (req, res, next) => {
  try {
    if (!req.body || !req.body.userId || !req.body.settings) {
      const error = new Error("Invalid data");
      error.statusCode = 400;
      throw error;
    }

    const { moduleId, userId, settings } = req.body;
    const userModule = await UserModule.findOne({
      where: { module_id: moduleId, user_id: userId },
    });
    if (userModule) {
      const currentSettings = userModule.settings;
      if (!currentSettings) {
        userModule.settings = settings;
        await userModule.save();

        res.status(200).json(userModule);
        return;
      } else {
        userModule.settings = currentSettings.concat(",", settings);

        await userModule.save();

        res.status(200).json(userModule);
        return;
      }
    } else {
      const newUserModule = await UserModule.create({
        module_id: moduleId,
        user_id: userId,
        settings: settings,
      });

      res.status(201).json(newUserModule).end();
      return;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllByUserId = async (req, res, next) => {
  try {
    if (!req.params || !req.params.userId) {
      const error = new Error("Invalid data");
      error.statusCode = 400;
      throw error;
    }
    const userId = req.params.userId;
    const userModule = await UserModule.findAll({ where: { user_id: userId } });
    if (!userModule) {
      const error = new Error("UserModule not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(userModule).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
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
    console.error("Error in update UserModule:", err.message);
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
    console.error("Error in delete UserModule:", err.message);
    const error = new Error("An error occurred while processing the request.");
    error.statusCode = 500;
    next(error);
  }
};
