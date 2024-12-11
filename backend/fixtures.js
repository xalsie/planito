require("dotenv").config();
const { faker, fi } = require('@faker-js/faker');
const User = require('./models/user');
const School = require('./models/school');
require('./models/db');




async function generateFixtures() {
  try {
    // Create 5 users
    const users = [];
    for (let i = 0; i < 5; i++) {

      const user = new User({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(['admin', 'intervenant'])
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
    }

    console.log("Fixtures successfully generated!");
  } catch (error) {
    console.error("Error generating fixtures:", error);
  }
}

generateFixtures();

