const moduleClass = require("../models/moduleClass");

const find = async (req, res, next) => {
    try {
        const moduleClass = await moduleClass.findAll();

        if (!moduleClass) {
            const error = new Error("ModuleClass not found.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(moduleClass);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const findById = async (req, res, next) => {
    try {
        const moduleClassId = req.params.moduleClassId;

        if (!moduleClassId) {
            const error = new Error("Invalid data");
            error.statusCode = 400;
            throw error;
        }

        const moduleClass = await moduleClass.findByPk(moduleClassId);

        if (!moduleClass) {
            const error = new Error("ModuleClass not found.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(moduleClass);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const create = async (req, res, next) => {
    try {
        const { moduleId, classId, userId } = req.body;

        if (!moduleId || !classId || !userId) {
            const error = new Error("Invalid data");
            error.statusCode = 400;
            next(error);
        }

        const moduleClass = await moduleClass.create({
            moduleId,
            classId,
            userId
        });

        res.status(201).json(moduleClass);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const updateById = async (req, res, next) => {
    try {
        const moduleClassId = req.params.moduleClassId;
        const { moduleId, classId, userId } = req.body;

        if (!moduleClassId || !moduleId || !classId || !userId) {
            const error = new Error("Invalid data");
            error.statusCode = 400;
            next(error);
        }

        const moduleClass = await moduleClass.findByPk(moduleClassId);

        if (!moduleClass) {
            const error = new Error("ModuleClass not found.");
            error.statusCode = 404;
            throw error;
        }

        moduleClass.moduleId = moduleId;
        moduleClass.classId = classId;
        moduleClass.userId = userId;

        await moduleClass.save();

        res.status(200).json(moduleClass);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const deleteById = async (req, res, next) => {
    try {
        const moduleClassId = req.params.moduleClassId;

        if (!moduleClassId) {
            const error = new Error("Invalid data");
            error.statusCode = 400;
            next(error);
        }

        const moduleClass = await moduleClass.findByPk(moduleClassId);

        if (!moduleClass) {
            const error = new Error("ModuleClass not found.");
            error.statusCode = 404;
            throw error;
        }

        await moduleClass.destroy();

        res.sendStatus(200);
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
    deleteById
}
