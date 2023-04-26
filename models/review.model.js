"use strict";

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Review;
};
