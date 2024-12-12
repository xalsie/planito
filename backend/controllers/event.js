const Event = require("../models/event");
const ical = require("node-ical");
const { EventType } = require("../enum");

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

const importIcalFromURL = async (req, res, next) => {
  try {
    if (!req.body || !req.body.url || !req.body.userId) {
      const error = new Error("Invalid data");
      error.statusCode = 400;
      throw error;
    }
    const { url, userId } = req.body;
    console.log("url", url);

    await ical.fromURL(url, {}, async function (err, data) {
      if (err) {
        const error = new Error(err);
        error.statusCode = 500;
        throw error;
      }
      let count = 0;
      const currentDate = new Date();
      // 31 Décembre de l'année prochaine
      const nextYear = new Date(currentDate.getFullYear() + 1, 11, 31);
      console.log("data");

      for (let k in data) {
        if (data.hasOwnProperty(k)) {
          const ev = data[k];

          if (ev.type === "VEVENT") {
            const startDate = new Date(ev.start);
            const endDate = new Date(ev.end);
            if (startDate >= currentDate)
              console.log(
                "Date",
                ++count,
                ":",
                startDate,
                " >= ",
                currentDate,
                " = ",
                startDate >= currentDate
              );
            else ++count;

            if (startDate >= currentDate && startDate <= nextYear) {
              console.log("before create");
              const event = Event.create({
                title: ev.summary || "No title",
                description: ev.description || "No description",
                type: EventType.UNAVAILABILITY,
                start: startDate,
                end: endDate,
                user_id: userId,
                isImported: true,
              });
              console.log("event");
              res.status(201).json(event).end();
              return;
            }
          }
        }
      }
      console.log("itérations: ", count);
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  find,
  findById,
  create,
  updateById,
  deleteById,
  importIcalFromURL,
};
