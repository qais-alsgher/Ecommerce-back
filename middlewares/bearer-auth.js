"use strict";
const User = require("../models").users;

const bearerAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).send("Please login first");
    }
    const token = req.headers.authorization.split(" ").pop();
    const validUser = await User.authenticateToken(token);
    const userInformation = await User.findOne({
      where: { email: validUser.email },
    });
    if (userInformation) {
      if (userInformation.status === "Blocked") {
        next("Your account is blocked");
      } else if (
        userInformation.confirmed &&
        userInformation.status === "Active"
      ) {
        req.user = userInformation;
        req.token = userInformation.token;
        next();
      } else {
        next("Please confirm your email");
      }
    } else {
      next("Invalid token");
    }
  } catch (error) {
    next(error.message || error);
  }
};

module.exports = bearerAuth;
