"use strict";

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        "https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png",
    },
    category: {
      type: DataTypes.ENUM("Pants", "Jacket", "Shoes", "T-shirt", "Other"),
      allowNull: false,
    },
    color: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    size: {
      type: DataTypes.ENUM("XS", "S", "M", "L", "XL"),
      allowNull: false,
    },
    clothesGender: {
      type: DataTypes.ENUM("Male", "Female", "Kids"),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priceStripe: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Item;
};
