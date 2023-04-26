"use strict";
const { decode } = require("base-64");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isEmail: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female"),
      allowNull: false,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:
        "https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png",
    },
    status: {
      type: DataTypes.ENUM("Active", "Blocked"),
      allowNull: false,
      defaultValue: "Active",
    },
    birhDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign(
          {
            email: this.email,
          },
          process.env.JWT_SECRET
        );
      },
      set(tokenObj) {
        return jwt.sign(tokenObj, process.env.JWT_SECRET);
      },
    },
    role: {
      type: DataTypes.ENUM("Admin", "User"),
      allowNull: false,
      defaultValue: "User",
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          User: ["read", "create"],
          Admin: ["read", "create", "update", "delete"],
        };
        return acl[this.role];
      },
    },
  });

  User.authenticateToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return Promise.reject(err);
        } else {
          return Promise.resolve(decoded);
        }
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  return User;
};
