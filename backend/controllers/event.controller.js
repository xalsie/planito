const Event = require('../models/event.models');

const find = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};

const findById = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

const create = async (req, res, next) => {
    const { title, description, date, location } = req.body;
    try {
        const event = await Event.create({
            title,
            description,
            date,
            location,
        });
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateById = async (req, res, next) => {
    const userId = req.params.userId;
    const { title, description, date, location } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        user.title = title;
        user.description = description;
        user.date = date;
        user.location = location;
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteById = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        await user.destroy();
        res.status(204).json();
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { find, findById, create, updateById, deleteById };