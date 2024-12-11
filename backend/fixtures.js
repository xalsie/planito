require("dotenv").config();
const { faker, fi } = require('@faker-js/faker');
const User = require('./models/user');
const School = require('./models/school');
const Room = require('./models/room');
const bcrypt = require("bcryptjs");
const Class = require('./models/class');
const Module = require('./models/module');
const Event = require('./models/event');
const { EventType } = require('./enum');

require('./models/db');




async function generateFixtures() {
  try {
    // Create 5 users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const hashedPw = await bcrypt.hash('test', 12);


      const user = new User({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPw,
        roles: faker.helpers.arrayElement([['ROLE_STAFF'], ['ROLE_INTERVENANT']])
      });
      await user.save();
      users.push(user);
    }

    // Create 3 schools
    const schools = [];
    for (let i = 0; i < 3; i++) {
      const school = new School({
        name: faker.company.name() + " School",
        address: faker.location.streetAddress(),
        interval: faker.helpers.arrayElement([30, 60, 90]), 
        opening_hours: '08:00:00',
        closing_hours: '17:00:00',
        user_id: faker.helpers.arrayElement(users).id
      });

      await school.save();
      schools.push(school);
    }
    
    // Create  15 rooms
    const rooms = [];
    for (let i = 0; i < 15; i++) {
      const room = new Room({
        name: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E', 'F']) + i,
        school_id: faker.helpers.arrayElement(schools).id
      });

      await room.save();
      rooms.push(room);
    }

    // Create 10 classes
    const classes = [];
    for (let i = 0; i < 10; i++) {
      const _class = new Class({
        name: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E', 'F']) + i,
        school_id: faker.helpers.arrayElement(schools).id
      });
      await _class.save();
      classes.push(_class);
    }

    // Create 10 modules
    const modules = [];
    const possibleModules = ['Symfony', 'React', 'Angular', 'Vue', 'Node', 'Express', 'Laravel', 'Django', 'Flask', 'Spring'];
    for (let i = 0; i < 10; i++) {
      const module = new Module({
        name: possibleModules[i],
        volHours: faker.number.int({ min: 10, max: 20 }),
        nbCc: faker.number.int({ min: 1, max: 3 }),
        volExams: faker.number.int({ min: 60, max: 180 })
      });

      await module.save();
      modules.push(module);
    }

    // create 20 events
    const events = [];
    for (let i = 0; i < 20; i++) {
      const start = getRandomWeekdayInDecember();
      const end = new Date(start.getTime() + 90 * 60 * 1000);
      

      const type = faker.helpers.arrayElement(Object.values(EventType));
      let event;

      if (type === EventType.AVAILABILITY) {
        event = new Event({
          start,
          end,
          type,
          title: 'User Availability',
          description: 'User is available during this time.',
          user_id: faker.helpers.arrayElement(users).id,
          room_id: null,
          module_id: null,
          class_id: null,
        });
      } else if (type === EventType.UNAVAILABILITY) {
        if (faker.datatype.boolean()) {
          event = new Event({
            start,
            end,
            type,
            title: 'User Unavailability',
            description: 'User is unavailable during this time.',
            user_id: faker.helpers.arrayElement(users).id,
            room_id: null,
            module_id: null,
            class_id: null,
          });
        } else {
          event = new Event({
            start,
            end,
            type,
            title: 'Class Unavailability',
            description: 'Class is unavailable during this time.',
            user_id: null,
            room_id: null,
            module_id: null,
            class_id: faker.helpers.arrayElement(classes).id,
          });
        }
      }else if (type === EventType.COURSE || type === EventType.EXAM) {
        event = new Event({
          start,
          end,
          type,
          title: type === EventType.COURSE ? 'Course Session' : 'Exam Session',
          description: type === EventType.COURSE ? 'A course is happening.' : 'An exam is scheduled.',
          user_id: faker.helpers.arrayElement(users).id,
          room_id: faker.helpers.arrayElement(rooms).id,
          module_id: faker.helpers.arrayElement(modules).id,
          class_id: faker.helpers.arrayElement(classes).id,
        });
      } else if (type === EventType.HOLIDAY) {
        event = new Event({
          start,
          end,
          type,
          title: 'Holiday',
          description: 'Holiday time.',
          user_id: null,
          room_id: null,
          module_id: null,
          class_id: null,
        });
      }
      
      await event.save();
      events.push(event);
    }

    console.log("Fixtures successfully generated!");
  } catch (error) {
    console.error("Error generating fixtures:", error);
  }
}

function isWeekday(date) {
  const day = date.getDay(); 
  return day !== 0 && day !== 6;
}

function getRandomWeekdayInDecember() {
  let randomDate;
  do {
    // Générer une date aléatoire en décembre
    randomDate = faker.date.between({ from: '2024-12-01T00:00:00.000Z', to: '2024-12-31T23:59:59.999Z' });
  } while (!isWeekday(randomDate)); 

  const validMinutes = [0, 15, 30, 45]; 
  const randomHour = faker.number.int({ min: 8, max: 18 }); 
  const randomMinute = faker.helpers.arrayElement(validMinutes); 

  randomDate.setHours(randomHour, randomMinute, 0, 0); 

  return randomDate;
}



generateFixtures();

