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
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    image: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [
        "https://res.cloudinary.com/dutml7fij/image/upload/v1686601685/noImage_llqw4a.jpg",
      ],
    },
    category: {
      type: DataTypes.ENUM(
        "Pajamas",
        "Sweatpants",
        "Jacket",
        "T-shirt",
        "Sneakers",
        "Other"
      ),
      allowNull: false,
    },
    color: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    size: {
      type: DataTypes.ARRAY(DataTypes.ENUM("XS", "S", "M", "L", "XL")),
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
    StripeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Item;
};
