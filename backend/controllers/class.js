const Class = require('../models/class');

const find = async (req, res, next) => {
    try {
        const classes = await Class.findAll();
        if (!classes) {
            const error = new Error("Class not found.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(classes);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const findBySchool = async (req, res, next) => {
    const schoolId = req.params.schoolId;
    try {
        const classes = await Class.findAll({
            where: {
                school_id: schoolId
            }
        });
        if (!classes) {
            const error = new Error("Class not found.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(classes);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const findById = async (req, res, next) => {
    const classId = req.params.classId;
    try {
        const classes = await Class.findByPk(classId);
        if (!classes) {
            const error = new Error("Class not found.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(classes);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const create = async (req, res, next) => {
    const { name, school_id } = req.body;
    try {
        const classes = await Class.create({
            name,
            schoolId: school_id
        });
        res.status(201).json(classes);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const updateById = async (req, res, next) => {
    const classId = req.params.classId;
    const { name, school_id } = req.body;
    try {
        const classes = await Class.findByPk(classId);
        if (!classes) {
            const error = new Error("Class not found.");
            error.statusCode = 404;
            throw error;
        }
        classes.name = name;
        classes.schoolId = school_id;
        await classes.save();
        res.status(200).json(classes);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const deleteById = async (req, res, next) => {
    const classId = req.params.classId;
    try {
        const classes = await Class.findByPk(classId);
        if (!classes) {
            const error = new Error("Class not found.");
            error.statusCode = 404;
            throw error;
        }
        await classes.destroy();
        res.status(204).end();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports = {
    find,
    findById,
    create,
    updateById,
    deleteById,
    findBySchool
};
