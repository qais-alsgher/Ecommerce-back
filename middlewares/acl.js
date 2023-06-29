"use strict";

const { users, items } = require("../models/index.js");

const acl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const user = await users.findOne({
      where: { id: userId },
    });
    if (user.role === "Admin" || userId === id) {
      next();
    } else {
      const item = await items.findOne({
        where: { id: id },
      });
      if (item.userId === userId) {
        next();
      } else {
        res.status(403).send("You are not authorized to access this resource");
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = acl;
