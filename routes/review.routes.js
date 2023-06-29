"use strict";
const router = require("express").Router();
const {
  getReview,
  getItemReview,
  createReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");
const bearerAuth = require("../middlewares/bearer-auth");

router.get("/review", getReview);
router.get("/review/:id", getItemReview);
router.post("/review", bearerAuth, createReview);
router.delete("/review/:id", bearerAuth, deleteReview);
router.put("/review/:id", bearerAuth, updateReview);

module.exports = router;
