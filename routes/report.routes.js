"use strict";
const router = require("express").Router();
const {
  getReport,
  getItemsReport,
  createReport,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");

// router.get("/report", getReport);
router.get("/report", getItemsReport);
router.post("/report", createReport);
router.delete("/report/:id", deleteReport);
router.put("/report/:id", updateReport);

module.exports = router;
