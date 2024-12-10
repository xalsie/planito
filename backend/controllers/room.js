const Room = require("../models/room");

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    await Room.create({ name });
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
    const rooms = await Room.findAll();
    res.status(200).json(rooms);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findByPk(roomId);
    if (!room) {
      const error = new Error("Could not find room.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(room);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    await Room.update(req.body, {
      where: {
        id: roomId,
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
    const roomId = req.params.roomId;
    const room = await Room.findByPk(roomId);
    if (!room) {
      const error = new Error("Could not find room.");
      error.statusCode = 404;
      throw error;
    }
    await room.destroy();
    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
