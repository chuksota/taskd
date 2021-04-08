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
      "Lists",
      [
        {
          name: "House Cleaning",
          dueDate: "2021-05-15",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Yard Work",
          dueDate: "2021-06-19",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Homework",
          dueDate: "2021-04-30",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Food Shopping",
          dueDate: "2021-04-25",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //4
        {
          name: "Clothes Shopping",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //5
        {
          name: "Party Prep",
          dueDate: "2021-06-25",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //6
        {
          name: "Upper Body Workout",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //7
        {
          name: "Lower Body Workout",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //8
        {
          name: "Core Workout",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //9
        {
          name: "Bike Parts",
          dueDate: "2021-04-22",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //10
        {
          name: "Car Maintenance",
          dueDate: "2021-06-01",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //11
        {
          name: "Garden Planning",
          dueDate: "2021-05-19",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //12
        {
          name: "Garden Planting",
          dueDate: "2021-05-25",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //13
        {
          name: "Honey Do",
          dueDate: "2021-07-15",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //14
        {
          name: "Plan for Anniversary",
          dueDate: "2021-08-05",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //15
        {
          name: "Vacation Prep",
          dueDate: "2021-09-15",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //16
        {
          name: "Computer Build",
          dueDate: "2021-08-15",
          userId: 1,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, //17
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
    return queryInterface.bulkDelete("Lists", null, {});
  },
};
