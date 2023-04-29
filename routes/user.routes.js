"use strict";
const router = require("express").Router();
const bearerAuth = require("../middlewares/bearer-auth");
const basicAuth = require("../middlewares/basic-auth");
const permissions = require("../middlewares/acl");
const {
  signup,
  login,
  verification,
  getUsers,
  userProfile,
  userProfileUpdate,
  userPurchasesBill,
  getUsersActive,
  getUsersBlocked,
} = require("../controllers/userController");

router.post("/signup", basicAuth, signup);
router.post("/login", bearerAuth, login);
// router.get("/users", bearerAuth, permissions("read"), getUsers);
router.get("/users", getUsers);
router.get("userProfile/:id", bearerAuth, userProfile);
router.put("/userProfile/:id", bearerAuth, userProfileUpdate);

router, post("/verification/:id", verification);
router.get("/userPurchasesBill/:id", bearerAuth, userPurchasesBill);
router.get("/usersActive", getUsersActive);
router.get("/usersBlocked", getUsersBlocked);

module.exports = router;
