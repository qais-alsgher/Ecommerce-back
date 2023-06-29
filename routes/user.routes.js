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
  getUsersActive,
  getUsersBlocked,
  blockedUser,
  activeUser,
  getUserStatistics,
  getItemStatistics,
  getSalesStatistics,
  getNumbersStatistics,
} = require("../controllers/userController");
const acl = require("../middlewares/acl");

router.post("/signup", basicAuth, signup);
router.post("/login", login);
// router.get("/users", bearerAuth, permissions("read"), getUsers);
router.get("/users", bearerAuth, acl, getUsers);
router.get("/userProfile/:id", bearerAuth, userProfile);
router.put("/userProfile/:id", bearerAuth, userProfileUpdate);

router.post("/verification/:id", verification);
router.get("/usersActive", bearerAuth, acl, getUsersActive);
router.get("/usersBlocked", bearerAuth, acl, getUsersBlocked);
router.put("/blockedUser/:id", bearerAuth, acl, blockedUser);
router.put("/activeUser/:id", bearerAuth, acl, activeUser);

router.get("/admin/numbersStatistics", bearerAuth, acl, getNumbersStatistics);
router.get("/admin/userStatistics", bearerAuth, acl, getUserStatistics);
router.get("/admin/itemStatistics", bearerAuth, acl, getItemStatistics);
router.get("/admin/salesStatistics", bearerAuth, acl, getSalesStatistics);

module.exports = router;
