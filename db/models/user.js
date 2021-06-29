"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userName: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      hashedPassword: { type: DataTypes.STRING.BINARY, allowNull: false },
      productivityScore: { type: DataTypes.INTEGER, default: 0 },
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.List, { foreignKey: "userId" });
  };
  return User;
};
