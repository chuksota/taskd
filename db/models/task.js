"use strict";
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      description: { type: DataTypes.STRING(200), allowNull: false },
      notes: DataTypes.STRING(500),
      dueDate: DataTypes.DATE,
      completed: { type: DataTypes.BOOLEAN, default: false },
      listId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Lists" },
      },
    },
    {}
  );
  Task.associate = function (models) {
    // associations can be defined here
    Task.belongsTo(models.List, { foreignKey: "listId" });
  };
  return Task;
};
