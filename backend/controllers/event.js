const Event = require("../models/event");
const ical = require("node-ical");
const { EventType } = require("../enum");
const { Op } = require("sequelize");
const Module = require("../models/module");
const Class = require("../models/class");
const Room = require("../models/room");
const Material = require("../models/material");
const User = require("../models/user");
const { fi } = require("@faker-js/faker");

const find = async (req, res, next) => {
  try {
    const events = await Event.findAll();
    if (!events) {
      res.status(404).json("Event not found");
      return;
    }
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json(err);
  }
};

const findById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const event = await Event.findByPk(userId);
    if (!event) {
      res.status(404).json("Event not found");
      return;
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json(err);
  }
};

const create = async (req, res, next) => {
  const { title, description, type, start, end } = req.body;
  try {
    const event = await Event.create({
      title,
      description,
      type,
      start,
      end,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json(err);
  }
};

const createAvailability = async (req, res, next) => {
  const { classId, type, start, end } = req.body;
  try {
    const event = await Event.create({
      class_id: classId,
      type,
      start,
      end,
    });
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAvailabilities = async (req, res, next) => {
  const { classId } = req.params;
  try {
    const whereObj = { type: EventType.AVAILABILITY };
    if (classId) whereObj.class_id = classId;
    const availabilities = await Event.findAll({
      attributes: ["id", "type", "start", "end", "class_id"],
      where: whereObj,
    });

    res.status(200).json(availabilities);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateById = async (req, res, next) => {
  const eventId = req.params.eventId;
  const { title, description, type, start, end } = req.body;
  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      res.status(404).json("Event not found");
      return;
    }
    event.title = title;
    event.description = description;
    event.type = type;
    event.start = start;
    event.end = end;
    await event.save();
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteById = async (req, res, next) => {
  const eventId = req.params.eventId;
  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      res.status(404).json("Event not found");
      return;
    }
    await event.destroy();
    res.status(204).json();
  } catch (err) {
    res.status(500).json(err);
  }
};

const findCoursesBySchool = async (req, res, next) => {
  const schoolId = req.params.schoolId;
  try {
    const events = await Event.findAll({
      attributes: ["id", "title", "description", "type", "start", "end"],
      where: {
        type: {
          [Op.in]: [EventType.COURSE, EventType.EXAM],
        },
      },
      include: [
        {
          model: Module,
          attributes: ["name"],
          where: {
            school_id: schoolId,
          },
        },
        {
          model: Class,
          attributes: ["id", "name"],
        },
        {
          model: Room,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });
    if (!events) {
      res.status(404).json("Event not found");
      return;
    }
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json(err);
  }
};

const importIcalFromURL = async (req, res, next) => {
  try {
    if (!req.body || !req.body.url || !req.body.userId) {
      const error = new Error("Invalid data");
      error.statusCode = 400;
      throw error;
    }
    const { url, userId } = req.body;

    await ical.fromURL(url, {}, async function (err, data) {
      if (err) {
        const error = new Error(err);
        error.statusCode = 500;
        throw error;
      }
      const currentDate = new Date();
      const nextYear = new Date(currentDate.getFullYear() + 1, 11, 31);

      for (let k in data) {
        if (data.hasOwnProperty(k)) {
          const ev = data[k];
          console.log("Event: " + ev.summary);

          if (
            ev.summary === "osuvghiliy" ||
            ev.summary === "izefubd" ||
            ev.summary === "okokok"
          ) {
            console.log("Event1: " + ev.type);
          }
          if (ev.type === "VEVENT") {
            const startDate = new Date(ev.start);
            const endDate = new Date(ev.end);

            if (startDate >= currentDate && startDate <= nextYear) {
              console.log("Event2: " + ev.summary);
              const event = await Event.create({
                title: ev.summary || "No title",
                description: ev.description || "No description",
                type: EventType.UNAVAILABILITY,
                start: startDate,
                end: endDate,
                user_id: userId,
                isImported: true,
              });
            }
          }
        }
      }
      res.status(201).json("events imported");
      return;
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const findEventsBySchoolByClass = async (req, res, next) => {
  const schoolId = req.params.schoolId;
  const classId = req.params.classId;
  try {
    const events = await Event.findAll({
      attributes: ["id", "title", "description", "type", "start", "end"],
      where: {
        type: {
          [Op.in]: [EventType.COURSE, EventType.EXAM],
        },
      },
      include: [
        {
          model: Module,
          attributes: ["name"],
          where: {
            school_id: schoolId,
          },
        },
        {
          model: Class,
          attributes: ["id", "name"],
          where: {
            id: classId,
          },
        },
        {
          model: Room,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });
    if (!events) {
      res.status(404).json("Event not found");
      return;
    }
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json(err);
  }
};

const findIntervenantEventsBySchool = async (req, res, next) => {
  const schoolId = req.params.schoolId;
  const userId = req.params.intervenantId;
  try {
    const events = await Event.findAll({
      attributes: ["id", "title", "description", "type", "start", "end"],
      where: {
        type: {
          [Op.in]: [EventType.COURSE, EventType.EXAM, EventType.UNAVAILABILITY],
        },
      },
      include: [
        {
          model: Module,
          attributes: ["name"],
          where: {
            school_id: schoolId,
          },
        },
        {
          model: Class,
          attributes: ["id", "name"],
        },
        {
          model: Room,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
          where: {
            id: userId,
          },
        },
      ],
    });
    if (!events) {
      res.status(404).json("Event not found");
      return;
    }
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json(err);
  }
};

const findIntervenantEvents = async (req, res, next) => {
  const userId = req.params.intervenantId;

  try {
    const events = await Event.findAll({
      attributes: ["id", "title", "description", "type", "start", "end"],
      where: {
        type: {
          [Op.in]: [EventType.COURSE, EventType.EXAM, EventType.UNAVAILABILITY],
        },
      },
      include: [
        {
          model: Module,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["id", "name"],
        },
        {
          model: Room,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
          where: {
            user_id: userId,
          },
        },
      ],
    });
    if (!events) {
      res.status(404).json("Event not found");
      return;
    }
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json(err);
  }
};

const findAvailabilityEventsBySchool = async (req, res, next) => {
  const schoolId = req.params.schoolId;
  try {
    const events = await Event.findAll({
      attributes: ["id", "type", "start", "end"],
      where: {
        type: EventType.AVAILABILITY,
      },
      include: [
        {
          model: Class,
          attributes: ["name"],
          where: {
            school_id: schoolId,
          },
        },
        {
          model: Room,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (!events) {
      const error = new Error("Could not find events.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(events);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const findAvailabilityEventsBySchoolByClass = async (req, res, next) => {
  const schoolId = req.params.schoolId;
  const classId = req.params.classId;
  try {
    const events = await Event.findAll({
      attributes: ["id", "type", "start", "end"],
      where: {
        type: EventType.AVAILABILITY,
      },
      include: [
        {
          model: Class,
          attributes: ["name"],
          where: {
            school_id: schoolId,
            id: classId,
          },
        },
        {
          model: Class,
          attributes: ["id", "name"],
        },
      ],
    });
    if (!events) {
      res.status(404).json("Event not found");
      return;
    }
    res.status(200).json(events);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const findEventsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      const error = new Error("User ID is required.");
      error.statusCode = 400;
      throw error;
    }

    const events = await Event.findAll({
      attributes: ["id", "title", "description", "type", "start", "end"],
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Module,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["id", "name"],
        },
        {
          model: Room,
          attributes: ["id", "name"],
        }
      ],
    });
    if (!events) {
      res.status(404).json("Event not found");
      return;
    }
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  find,
  findById,
  create,
  updateById,
  deleteById,
  importIcalFromURL,
  findCoursesBySchool,
  findEventsBySchoolByClass,
  findIntervenantEventsBySchool,
  findIntervenantEvents,
  findAvailabilityEventsBySchool,
  findAvailabilityEventsBySchoolByClass,
  findEventsByUser,
  createAvailability,
  getAvailabilities,
};
