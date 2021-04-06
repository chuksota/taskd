'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [{
      description: 'Mop the kitchen floor',
      listId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      description: 'Scrub the counters',
      notes: 'Make sure to bleach the grout lines',
      listId: 1,
      dueDate: new Date('2021-05-12'),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      description: 'Rake the leaves',
      listId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      description: 'Mow the lawn',
      dueDate: new Date('2021-05-05'),
      listId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      description: 'Finish leet code problems',
      notes: 'Finish problems 4, 3, and 2 first',
      listId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      description: 'Figure out CSS animations',
      dueDate: new Date('2021-04-06'),
      listId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tasks', null, {});
  }
};
