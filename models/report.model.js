"use strict";

module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define("Report", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reportMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Report;
};
