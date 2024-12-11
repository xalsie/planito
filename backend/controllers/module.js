const Module = require("../models/module");

exports.create = async (req, res, next) => {
  try {
    const { name, volHours, nbClasses, nbCc, volExams } = req.body;
    await Module.create({
      name: name,
      volHours: volHours,
      nbClasses: nbClasses,
      nbCc: nbCc,
      volExams: volExams,
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
    const modules = await Module.findAll();
    res.status(200).json(modules);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId;
    const module = await Module.findByPk(moduleId);
    if (!module) {
      const error = new Error("Could not find module.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(module);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId;
    await Module.update(req.body, {
      where: {
        id: moduleId,
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
    const moduleId = req.params.moduleId;
    const module = await Module.findByPk(moduleId);
    if (!module) {
      const error = new Error("Could not find module.");
      error.statusCode = 404;
      throw error;
    }
    await module.destroy();
    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
