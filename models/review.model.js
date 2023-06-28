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
      type: DataTypes.ENUM("0", "1", "2", "3", "4", "5"),
      allowNull: false,
    },
  });
  return Review;
};
