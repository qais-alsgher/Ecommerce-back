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
router.get("/report", getItemsReport);
router.post("/report", createReport);
router.delete("/report/:id", deleteReport);
router.put("/report/:id", updateReport);

router.get("/report/users", getUsersReport);

module.exports = router;
