"use strict";
const router = require("express").Router();
const {
  getReview,
  getItemReview,
  createReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");

router.get("/review", getReview);
router.get("/review/:id", getItemReview);
router.post("/review", createReview);
router.delete("/review/:id", deleteReview);
router.put("/review/:id", updateReview);

module.exports = router;
