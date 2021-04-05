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
