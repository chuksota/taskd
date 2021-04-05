"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING(500),
      },
      dueDate: {
        type: Sequelize.DATE,
      },
      completed: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      listId: {
        type: Sequelize.INTEGER,
        references: { model: "Lists" },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Tasks");
  },
};
