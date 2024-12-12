const Event = require("../models/event");

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

module.exports = { find, findById, create, updateById, deleteById };
