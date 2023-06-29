"use strict";
const router = require("express").Router();
const {
  getReport,
  getItemsReport,
  createReport,
  updateReport,
  deleteReport,
  getUsersReport,
} = require("../controllers/reportController");
const bearerAuth = require("../middlewares/bearer-auth");

// router.get("/report", getReport);
router.get("/report", bearerAuth, getItemsReport);
router.post("/report", bearerAuth, createReport);
router.delete("/report/:id", bearerAuth, deleteReport);
router.put("/report/:id", bearerAuth, updateReport);

router.get("/report/users", bearerAuth, getUsersReport);

module.exports = router;
