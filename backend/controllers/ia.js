const { Op } = require("sequelize");
require("dotenv").config();
const Class = require("../models/class");
const School = require("../models/school");
const Event = require("../models/event");
const ModuleClass = require("../models/moduleClass");
const User = require("../models/user");
const Module = require("../models/module");
const Room = require("../models/room");

async function getSchedulData(schoolId, classId, startDate) {
  try {
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
      classes: {
        id: classData.id,
        availability: classAvailability,
      },
      modules: modules,
      users_unavailability: usersUnavailability,
    };
    return response;
  } catch (err) {
    console.error(err);
  }
}

exports.generateEvents = async (req, res, next) => {
  try {
    const { schoolId, classId, startDate } = req.body;

    const getScheduleData = await getSchedulData(schoolId, classId, startDate);

    if (!getScheduleData) {
      return res.status(404).json({
        status: "error",
        message: "Failed to retrieve schedule data",
      });
    }

    const generateEvents = generateSchedule(getScheduleData);
    insertEvents(generateEvents, classId);

    return res.status(201).json({
      message: "Events generated successfully",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

function generateSchedule(data) {
  const openingHours = data.school.opening_hours;
  const closingHours = data.school.closing_hours;
  const eventInterval = data.school.event_interval_hours;

  const availability = data.classes.availability;
  const modules = data.modules;
  const usersUnavailability = data.users_unavailability;
  let events = [];

  // Convertir l'heure d'ouverture et de fermeture en format Date pour les calculs
  function convertTimeToDate(date, time) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, seconds, 0);
    return newDate;
  }

  // Fonction pour vérifier si une heure donnée est dans les horaires de non-disponibilité d'un utilisateur
  function isUserUnavailable(userId, startTime, endTime) {
    const userUnavailability = usersUnavailability.find(
      (u) => u.user_id === userId
    );
    if (!userUnavailability) return false;

    return userUnavailability.events.some((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return startTime < eventEnd && endTime > eventStart;
    });
  }

  // Fonction pour ajouter un événement à la liste
  function addEvent(startTime, endTime, userId, moduleId) {
    events.push({
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      type: "course",
      title: modules.find((module) => module.id === moduleId).name,
      description: "course",
      user_id: userId,
      module_id: moduleId,
    });
    console.log(
      `Event added: ${startTime.toISOString()} - ${endTime.toISOString()} for user ${userId} with module ${moduleId}`
    );
  }

  // Fonction pour planifier les modules en évitant le mélange de modules d'un jour à l'autre
  function planModuleForDay(currentDay, remainingHours, modulesForDay) {
    let dayStart = convertTimeToDate(currentDay, openingHours);
    let dayEnd = convertTimeToDate(currentDay, closingHours);

    let currentTime = new Date(dayStart);
    let morningRemainingHours = parseFloat(modulesForDay[0].volHours);
    let afternoonRemainingHours = parseFloat(modulesForDay[1].volHours);

    // Planification du matin (08:00 à 13:00)
    while (currentTime.getHours() < 13 && morningRemainingHours > 0) {
      const eventEnd = new Date(currentTime);
      eventEnd.setHours(eventEnd.getHours() + eventInterval);

      if (isUserUnavailable(modulesForDay[0].user_id, currentTime, eventEnd)) {
        currentTime.setHours(currentTime.getHours() + eventInterval);
        continue;
      }

      addEvent(
        currentTime,
        eventEnd,
        modulesForDay[0].user_id,
        modulesForDay[0].id
      );

      morningRemainingHours -= eventInterval;
      currentTime.setHours(currentTime.getHours() + eventInterval);
    }

    // Pause déjeuner de 13h à 14h
    currentTime.setHours(14, 0, 0);

    // Planification de l'après-midi (14:00 à 17:00)
    while (currentTime.getHours() < 17 && afternoonRemainingHours > 0) {
      const eventEnd = new Date(currentTime);
      eventEnd.setHours(eventEnd.getHours() + eventInterval);

      if (isUserUnavailable(modulesForDay[1].user_id, currentTime, eventEnd)) {
        currentTime.setHours(currentTime.getHours() + eventInterval);
        continue;
      }

      addEvent(
        currentTime,
        eventEnd,
        modulesForDay[1].user_id,
        modulesForDay[1].id
      );

      afternoonRemainingHours -= eventInterval;
      currentTime.setHours(currentTime.getHours() + eventInterval);
    }

    return remainingHours - (morningRemainingHours + afternoonRemainingHours);
  }

  // Fonction pour alterner les modules
  function getAlternatingModules() {
    let modulesForDay = [];
    let moduleIndex = 0;

    // Filtrer les modules qui ont la propriété 'volHours' définie
    const validModules = modules.filter((module) => module.volHours);

    // Si les modules sont suffisamment nombreux, alternons-les
    if (validModules.length >= 2) {
      modulesForDay.push(validModules[moduleIndex]);
      modulesForDay.push(validModules[moduleIndex + 1]);
    }

    if (modulesForDay.length === 0) {
      console.error("No valid modules to schedule!");
    }

    return modulesForDay;
  }

  // Parcourir chaque module pour planifier les événements
  let currentDay = new Date(availability[0].start); // Premier jour disponible
  let remainingHours = 0;

  // Pour chaque jour, alterner les modules et planifier les événements
  while (currentDay <= new Date(availability[0].end)) {
    let modulesForDay = getAlternatingModules();

    if (modulesForDay.length > 0) {
      remainingHours = planModuleForDay(
        currentDay,
        remainingHours,
        modulesForDay
      );
    }

    currentDay.setDate(currentDay.getDate() + 1); // Passer au jour suivant
  }

  return events; // Retourner tous les événements générés
}

function insertEvents(events, classId) {
  events.forEach(async (event) => {
    try {
      let room = findOneOfDisponibilityRoom(event.start, event.end);
      await Event.create({
        start: event.start,
        end: event.end,
        type: event.type,
        title: event.title,
        description: event.description,
        user_id: event.user_id,
        module_id: event.module_id,
        class_id: classId,
        room_id: room.id,
      });
    } catch (error) {
      console.error("Error inserting event:", error);
    }
  });
}

async function findOneOfDisponibilityRoom(start, end) {
  let rooms = await Room.findAll({});

  for (let room of rooms) {
    let events = Event.findAll({
      where: {
        room_id: room.id,
        start: { [Op.lte]: end },
        end: { [Op.gte]: start },
      },
    });

    if (events.length === 0) {
      return room;
    }
  }
}
