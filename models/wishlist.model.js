"use strict";

module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define("Wishlist", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Wishlist;
};
