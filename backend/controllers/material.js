const Material = require("../models/material");

exports.create = async (req, res, next) => {
  try {
    const { name, quantity } = req.body;
    await Material.create({ name, quantity });
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
    const materials = await Material.findAll();
    res.status(200).json(materials);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const materialId = req.params.materialId;
    const material = await Material.findByPk(materialId);
    if (!material) {
      const error = new Error("Could not find material.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(material);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const materialId = req.params.materialId;
    await Material.update(req.body, {
      where: {
        id: materialId,
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
    const materialId = req.params.materialId;
    const material = await Material.findByPk(materialId);
    if (!material) {
      const error = new Error("Could not find material.");
      error.statusCode = 404;
      throw error;
    }
    await material.destroy();
    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
