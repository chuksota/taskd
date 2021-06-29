"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          userName: "Demo",
          email: "demo@demo.com",
          hashedPassword: "password",
          productivityScore: 1858,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userName: "slightlyProductive",
          email: "demo1@demo.com",
          hashedPassword: "password",
          productivityScore: 3145,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userName: "taskMaster",
          email: "demo2@demo.com",
          hashedPassword: "password",
          productivityScore: 8231,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userName: "Mild Procrastinator",
          email: "demo3@demo.com",
          hashedPassword: "password",
          productivityScore: 734,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userName: "High Achiever",
          email: "demo4@demo.com",
          hashedPassword: "password",
          productivityScore: 8048,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userName: "Slacker",
          email: "demo5@demo.com",
          hashedPassword: "password",
          productivityScore: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("Users", null, {});
  },
};
