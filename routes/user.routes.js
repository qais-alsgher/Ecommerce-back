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
  blockedUser,
} = require("../controllers/userController");

router.post("/signup", basicAuth, signup);
router.post("/login", login);
// router.get("/users", bearerAuth, permissions("read"), getUsers);
router.get("/users", bearerAuth, getUsers);
router.get("/userProfile/:id", bearerAuth, userProfile);
router.put("/userProfile/:id", bearerAuth, userProfileUpdate);

router.post("/verification/:id", verification);
router.get("/userPurchasesBill/:id", bearerAuth, userPurchasesBill);
router.get("/usersActive", bearerAuth, getUsersActive);
router.get("/usersBlocked", bearerAuth, getUsersBlocked);
router.put("/blockedUser/:id", bearerAuth, blockedUser);

module.exports = router;
