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
      date_range: {
        start: startDate,
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

    let { school, date_range, classes, modules, users_unavailability } =
      getScheduleData;
    school = JSON.stringify(school);
    date_range = JSON.stringify(date_range);
    classes = JSON.stringify(classes);
    modules = JSON.stringify(modules);
    users_unavailability = JSON.stringify(users_unavailability);

    const messageSchool = `The school operates from ${school.opening_hours} to ${school.closing_hours}. The event interval is set to ${school.event_interval_hours} minutes.`;
    const messageDateRange = `The class schedule starts on ${date_range.start}, and events should be planned within this availability period until the class's total hours (volHours) are completed.`;
    const messageClasses = `Class availability period is: ${JSON.stringify(
      classes
    )}`;
    const messageModules = `Modules and required hours: ${JSON.stringify(
      modules
    )}`;
    const messageUsersUnavailability = `Users' unavailability periods: ${JSON.stringify(
      users_unavailability
    )}`;

   

   

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          "content": "You are a scheduling assistant responsible for generating a timetable for courses based on certain rules. You must ensure that events are scheduled according to the following constraints and logic."
        },
        {
          role: "user",
          "content": `
          Here is the data:
          
          const data = ${JSON.stringify(getScheduleData)};
          
          ### Event Scheduling Rules:
          
          1. **School Hours**: Events can only occur between \`data.school.opening_hours\` and \`data.school.closing_hours\`. No events should be scheduled outside of these times.
          
          2. **Event Interval**: Each event must be scheduled at fixed intervals of \`data.school.event_interval_hours\` (in hours). For instance, if the interval is 1 hours, events should be scheduled at 08:00, 09:00, 09:00, 10:00, etc. The events should start and end exactly at these times with no deviation from the fixed interval.
          
          3. **Lunch Break**: Ensure that no events are scheduled between 13:00 and 14:00 every day.
          
          4. **Class Availability**: Schedule events only during the class availability period specified in \`data.classes.availability\`. This availability is valid for all days within the given date range. Events should be scheduled strictly during this time window, avoiding any outside time.
          
          5. **User Unavailability**: Ensure no events are scheduled during users' unavailable times, specified in \`data.users_unavailability\`. For instance, the user with \`user_id = "50433af8-0d41-41d0-9540-93689961f714"\` is unavailable on January 7th from 08:00 to 11:00. Therefore, no events should be scheduled for this user during that time. Events must be scheduled only during periods where the user is available.
          
          6. **Module Hours**: Each module has a \`volHours\` property, indicating the total number of hours that need to be scheduled. These hours should be scheduled evenly across the available days, respecting the fixed event intervals. Ensure that the total hours (volHours) for each module are spread over multiple days if needed.
          
          7. **Alternating Modules**: Schedule modules alternately each day. For instance, if "React" is scheduled before lunch (08:00-12:00), then "Laravel" should be scheduled after lunch (14:00-18:00). This alternation should occur for every day within the availability range. Modules should not be scheduled back-to-back without alternating, and the alternation should happen daily.
          
          8. **Output Format**:
             Return the scheduled events as a JSON array, in the following format:
          
          \`\`\`json
          [
            {
              "start": "start_time",
              "end": "end_time",
              "type": "course",
              "title": "module_name",
              "description": "module_description",
              "user_id": "user_id",
              "module_id": "module_id"
            }
          ]
          \`\`\`
          
          ### Example Logic:
          - For each day within the \`data.classes.availability\` period:
            1. Start scheduling events from the school opening time (e.g., 08:00). 
            2. Follow the fixed event interval defined by \`data.school.event_interval_hours\` (e.g., 2 hours).
            3. Ensure that no event is scheduled during lunch break (13:00 to 14:00).
            4. Alternate the modules daily (e.g., React in the morning, Laravel in the afternoon).
            5. Make sure each module's total hours (volHours) are scheduled across the available days and respect the availability time window.
            6. Respect the user unavailability windows and avoid scheduling events during those times.
          
          Generate the timetable based on this logic and the provided data. Output only the JSON array of scheduled events, with no additional text or explanations.
          `
        },
      ],
    });
    //res.json({ estimation: completion.choices[0].message.content });

    return res.status(201).json({
      message: "Events generated successfully",
      data: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

function generateTimetable(data) {
  const result = [];
  const schoolOpening = new Date(`1970-01-01T${data.school.opening_hours}`);
  const schoolClosing = new Date(`1970-01-01T${data.school.closing_hours}`);
  const eventInterval = data.school.event_interval_hours * 60 * 60 * 1000; // Convert hours to ms
  const breakStart = new Date("1970-01-01T13:00:00");
  const breakEnd = new Date("1970-01-01T14:00:00");

  const availability = data.classes.availability.map((a) => ({
    start: new Date(a.start),
    end: new Date(a.end),
  }));

  const modules = data.modules.map((m) => ({
    ...m,
    volHours: parseFloat(m.volHours),
    scheduledHours: 0,
  }));

  const unavailability = data.users_unavailability.reduce((acc, u) => {
    acc[u.user_id] = u.events.map((e) => ({
      start: new Date(e.start),
      end: new Date(e.end),
    }));
    return acc;
  }, {});

  function isTimeAvailable(userId, start, end) {
    const userUnavailability = unavailability[userId] || [];
    return userUnavailability.every((u) => end <= u.start || start >= u.end);
  }

  function scheduleEvent(module, start, end) {
    result.push({
      start: start.toISOString(),
      end: end.toISOString(),
      type: "course",
      title: module.name,
      description: module.name,
      user_id: module.user_id,
      module_id: module.id,
    });
    module.scheduledHours += (end - start) / (60 * 60 * 1000);
  }

  availability.forEach(({ start: dayStart, end: dayEnd }) => {
    for (
      let currentDate = new Date(dayStart);
      currentDate < dayEnd;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      let currentTime = new Date(currentDate);
      currentTime.setHours(
        schoolOpening.getHours(),
        schoolOpening.getMinutes(),
        0,
        0
      );

      while (
        currentTime < new Date(currentDate).setHours(schoolClosing.getHours())
      ) {
        const nextTime = new Date(currentTime.getTime() + eventInterval);
        const isBreak = currentTime >= breakStart && currentTime < breakEnd;
        const fitsInDay =
          nextTime <= new Date(currentDate).setHours(schoolClosing.getHours());

        if (!isBreak && fitsInDay) {
          for (const module of modules) {
            if (
              module.scheduledHours < module.volHours &&
              isTimeAvailable(module.user_id, currentTime, nextTime)
            ) {
              scheduleEvent(module, currentTime, nextTime);

              // Alternate modules before and after the break
              if (currentTime < breakStart) {
                modules.push(modules.shift()); // Rotate modules to alternate
              }

              break;
            }
          }
        }

        currentTime = nextTime;
      }
    }
  });

  return JSON.stringify(result, null, 2);
}
