const School = require("../models/school");

exports.create = async (req, res, next) => {
  try {
    const { name, address, interval, opening_hours, closing_hours } = req.body;
    await School.create({
      name: name,
      address: address,
      interval: interval,
      opening_hours: opening_hours,
      closing_hours: closing_hours,
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
    const schools = await School.findAll();
    res.status(200).json(schools);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
};

exports.findById = async (req, res, next) => {
  try {
    const school = await School.findByPk(req.params.id);
    res.status(200).json(school);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
};

exports.update = async (req, res, next) => {
  try {
    const { name, address, interval, opening_hours, closing_hours } = req.body;
    const school = await School.findByPk(req.params.id);
    school.name = name;
    school.address = address;
    school.interval = interval;
    school.opening_hours = opening_hours;
    school.closing_hours = closing_hours;
    await school.save();
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
    const school = await School.findByPk(req.params.id);
    await school.destroy();
    res.sendStatus(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
};
