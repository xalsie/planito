const { Op } = require("sequelize");
const OpenAI = require("openai");
const Class = require("../models/class");
const School = require("../models/school");
const Event = require("../models/event");
const ModuleClass = require("../models/moduleClass");
const User = require("../models/user");
const Module = require("../models/module");


exports.getSchedulData = async (req, res, next) => {
  try {
    const { schoolId, classId, startDate, endDate } = req.query;

    console.log("schoolId", schoolId);

    // 1. Fetch school data
    const school = await School.findOne({
      where: { id: schoolId },
      attributes: ["id", "opening_hours", "closing_hours", "interval"],
    });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // 2. Fetch class availability
    const classData = await Class.findOne({
      where: { id: classId },
      include: [
        {
          model: Event,
          where: {
            type: "availability",
            start: { [Op.gte]: startDate },
            end: { [Op.lte]: endDate },
          },
          attributes: ["start", "end"],
        },
      ],
    });
    if (!classData) {
      return res
        .status(404)
        .json({ message: "Class not found or no availability found" });
    }

    const classAvailability = classData.events.map((event) => ({
      start: event.start,
      end: event.end,
    }));

    // 3. Fetch modules of the class
    const moduleClasses = await ModuleClass.findAll({
      attributes: ["id"],
      where: { class_id: classId },
      include: [
        {
          model: Module,
          attributes: ["id", "name", "volHours"],
        },
        {
          model: User,
          attributes: ["id"],
        },
      ],
    });

    const modules = moduleClasses.map((mc) => ({
      id: mc.module.id,
      name: mc.module.name,
      user_id: mc.user.id,
      volHours: mc.module.volHours || 0, // Assuming `total_hours` is a field in Module
    }));

    // 4. Fetch user unavailability
    const userIds = modules.map((mod) => mod.user_id);
    const userUnavailabilityEvents = await Event.findAll({
      where: {
        user_id: { [Op.in]: userIds },
        type: "unavailability",
        start: { [Op.gte]: startDate },
        end: { [Op.lte]: endDate },
      },
      attributes: ["user_id", "start", "end", "type"],
    });

    const usersUnavailability = userIds.map((userId) => ({
      user_id: userId,
      events: userUnavailabilityEvents
        .filter((event) => event.user_id === userId)
        .map((event) => ({
          start: event.start,
          end: event.end,
          type: event.type,
        })),
    }));

    const response = {
        school: {
          id: school.id,
          opening_hours: school.opening_hours,
          closing_hours: school.closing_hours,
          event_interval_hours: school.interval, 
        },
        date_range: {
          start: startDate,
          end: endDate,
        },
        class: {
          id: classData.id,
          availability: classAvailability,
        },
        modules: modules,
        users_unavailability: usersUnavailability,
      };
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.generateEvents = async (req, res, next) => {
    try {
        const { schoolId, classId, startDate, endDate } = req.query;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    
       const getScheduleData = await this.getSchedulData(req, res, next);
       const schoolInfo = getScheduleData.school;

       const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "",
            },
            {
                role: "user",
                content: ``,
            },
        ],
    });
    res.json({ estimation: completion.choices[0].message.content });

    
        return res.status(201).json(schoolInfo);
    } catch (err) {
        console.error(err);
        next(err);
    }
    }
