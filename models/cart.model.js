"use strict";

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNulll: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.ENUM("XS", "S", "M", "L", "XL"),
      allowNull: false,
    },
    status: {
      // for paid or not paid
      type: DataTypes.ENUM("pending", "paid"),
      allowNull: false,
      defaultValue: "Pending",
    },
  });
  return Cart;
};
