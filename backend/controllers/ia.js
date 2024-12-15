const { Op } = require("sequelize");
require("dotenv").config();
const OpenAI = require("openai");
const Class = require("../models/class");
const School = require("../models/school");
const Event = require("../models/event");
const ModuleClass = require("../models/moduleClass");
const User = require("../models/user");
const Module = require("../models/module");

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
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const getScheduleData = await getSchedulData(schoolId, classId, startDate);

    if (!getScheduleData) {
      return res.status(404).json({
        status: "error",
        message: "Failed to retrieve schedule data",
      });
    }

    // const exemplePrompt = `
    //       Here is the data:
          
    //       const data = ${JSON.stringify(getScheduleData)};
          
    //       ### Event Scheduling Rules:
          
    //       1. **School Hours**: Events can only occur between \`data.school.opening_hours\` and \`data.school.closing_hours\`. No events should be scheduled outside of these times.
          
    //       2. **Event Interval**: Each event must be scheduled at fixed intervals of \`data.school.event_interval_hours\` (in hours). For instance, if the interval is 1 hours, events should be scheduled at 08:00, 09:00, 09:00, 10:00, etc. The events should start and end exactly at these times with no deviation from the fixed interval.
          
    //       3. **Lunch Break**: Ensure that no events are scheduled between 13:00 and 14:00 every day.
          
    //       4. **Class Availability**: Schedule events only during the class availability period specified in \`data.classes.availability\`. This availability is valid for all days within the given date range. Events should be scheduled strictly during this time window, avoiding any outside time.
          
    //       5. **User Unavailability**: Ensure no events are scheduled during users' unavailable times, specified in \`data.users_unavailability\`. For instance, the user with \`user_id = "50433af8-0d41-41d0-9540-93689961f714"\` is unavailable on January 7th from 08:00 to 11:00. Therefore, no events should be scheduled for this user during that time. Events must be scheduled only during periods where the user is available.
          
    //       6. **Module Hours**: Each module has a \`volHours\` property, indicating the total number of hours that need to be scheduled. These hours should be scheduled evenly across the available days, respecting the fixed event intervals. Ensure that the total hours (volHours) for each module are spread over multiple days if needed.
          
    //       7. **Alternating Modules**: Schedule modules alternately each day. For instance, if "React" is scheduled before lunch (08:00-12:00), then "Laravel" should be scheduled after lunch (14:00-18:00). This alternation should occur for every day within the availability range. Modules should not be scheduled back-to-back without alternating, and the alternation should happen daily.
          
    //       8. **Output Format**:
    //          Return the scheduled events as a JSON array, in the following format:
          
    //       \`\`\`json
    //       [
    //         {
    //           "start": "start_time",
    //           "end": "end_time",
    //           "type": "course",
    //           "title": "module_name",
    //           "description": "module_description",
    //           "user_id": "user_id",
    //           "module_id": "module_id"
    //         }
    //       ]
    //       \`\`\`
          
    //       ### Example Logic:
    //       - For each day within the \`data.classes.availability\` period:
    //         1. Start scheduling events from the school opening time (e.g., 08:00). 
    //         2. Follow the fixed event interval defined by \`data.school.event_interval_hours\` (e.g., 2 hours).
    //         3. Ensure that no event is scheduled during lunch break (13:00 to 14:00).
    //         4. Alternate the modules daily (e.g., React in the morning, Laravel in the afternoon).
    //         5. Make sure each module's total hours (volHours) are scheduled across the available days and respect the availability time window.
    //         6. Respect the user unavailability windows and avoid scheduling events during those times.
          
    //       Generate the timetable based on this logic and the provided data. Output only the JSON array of scheduled events, with no additional text or explanations.
    //      `;

    // const completion = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       "content": "You are a scheduling assistant responsible for generating a timetable for courses based on certain rules. You must ensure that events are scheduled according to the following constraints and logic."
    //     },
    //     {
    //       role: "user",
    //       "content": ``
    //     },
    //   ],
    // });

    
    
    
    
    //res.json({ estimation: completion.choices[0].message.content });

    return res.status(201).json({
      message: "Events generated successfully",
      //data: completion.choices[0].message.content,
      data: generateSchedule(getScheduleData),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


function generateSchedule(data) {
  const openingHours = data.school.opening_hours;  // "08:00:00"
  const closingHours = data.school.closing_hours;  // "17:00:00"
  const eventInterval = data.school.event_interval_hours;  // Intervalle de l'événement (1 heure)

  const availability = data.classes.availability;  // Disponibilité des classes
  const modules = data.modules;  // Modules à programmer
  const usersUnavailability = data.users_unavailability;  // Non-disponibilité des utilisateurs
  let events = [];

  // Convertir l'heure d'ouverture et de fermeture en format Date pour les calculs
  function convertTimeToDate(date, time) {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, seconds, 0);  // Mettre à jour les heures, minutes, et secondes
      return newDate;
  }

  // Fonction pour vérifier si une heure donnée est dans les horaires de non-disponibilité d'un utilisateur
  function isUserUnavailable(userId, startTime, endTime) {
      const userUnavailability = usersUnavailability.find(u => u.user_id === userId);
      if (!userUnavailability) return false;
      
      return userUnavailability.events.some(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return (startTime < eventEnd && endTime > eventStart); // Vérifie si les horaires se chevauchent
      });
  }

  // Fonction pour ajouter un événement à la liste
  function addEvent(startTime, endTime, userId, moduleId) {
      events.push({
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          type: "course",
          title: modules.find(module => module.id === moduleId).name,
          description: null,  // Tu peux ajouter des descriptions ici si nécessaire
          user_id: userId,
          module_id: moduleId
      });
  }

  // Fonction pour planifier les modules en évitant le mélange de modules d'un jour à l'autre
  function planModuleForDay(module, currentDay, remainingHours) {
      let dayStart = convertTimeToDate(currentDay, openingHours);  // Utiliser les horaires d'ouverture de l'école
      let dayEnd = convertTimeToDate(currentDay, closingHours);  // Utiliser les horaires de fermeture de l'école

      let currentTime = new Date(dayStart);

      // Planification du matin (08:00 à 13:00)
      while (currentTime.getHours() < 13 && remainingHours > 0) {
          // Vérification de la non-disponibilité de l'utilisateur
          const eventEnd = new Date(currentTime);
          eventEnd.setHours(eventEnd.getHours() + eventInterval);

          if (isUserUnavailable(module.user_id, currentTime, eventEnd)) {
              currentTime.setHours(currentTime.getHours() + eventInterval);  // Passer à l'heure suivante
              continue;
          }

          // Ajouter l'événement
          addEvent(currentTime, eventEnd, module.user_id, module.id);
          
          remainingHours -= eventInterval;  // Réduire le nombre d'heures restantes à planifier
          currentTime.setHours(currentTime.getHours() + eventInterval);  // Passer à l'heure suivante
      }

      // Pause déjeuner de 13h à 14h
      currentTime.setHours(14, 0, 0);  // Passer à 14:00 pour l'après-midi

      // Planification de l'après-midi (14:00 à 17:00)
      while (currentTime.getHours() < 17 && remainingHours > 0) {
          // Vérification de la non-disponibilité de l'utilisateur
          const eventEnd = new Date(currentTime);
          eventEnd.setHours(eventEnd.getHours() + eventInterval);

          if (isUserUnavailable(module.user_id, currentTime, eventEnd)) {
              currentTime.setHours(currentTime.getHours() + eventInterval);  // Passer à l'heure suivante
              continue;
          }

          // Ajouter l'événement
          addEvent(currentTime, eventEnd, module.user_id, module.id);
          
          remainingHours -= eventInterval;  // Réduire le nombre d'heures restantes à planifier
          currentTime.setHours(currentTime.getHours() + eventInterval);  // Passer à l'heure suivante
      }

      return remainingHours;
  }

  // Parcourir chaque module pour planifier les événements
  let currentDay = new Date(availability[0].start);  // Premier jour disponible
  modules.forEach(module => {
      let remainingHours = parseFloat(module.volHours);  // VolHours du module à planifier

      // Planification continue sans revenir au jour de départ
      while (remainingHours > 0 && currentDay <= new Date(availability[0].end)) {
          remainingHours = planModuleForDay(module, currentDay, remainingHours);
          currentDay.setDate(currentDay.getDate() + 1);  // Passer au jour suivant
      }
  });

  return events;  // Retourner tous les événements générés
}






















