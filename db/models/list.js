"use strict";
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define(
    "List",
    {
      name: { type: DataTypes.STRING(50), allowNull: false },
      dueDate: DataTypes.DATE,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users" },
      },
      completed: { type: DataTypes.BOOLEAN, default: false },
    },
    {}
  );
  List.associate = function (models) {
    // associations can be defined here
    List.belongsTo(models.User, { foreignKey: "userId" });
    List.hasMany(models.Task, { foreignKey: "listId" });
  };
  return List;
};
