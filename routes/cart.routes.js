"use strict";
const router = require("express").Router();
const {
  getCart,
  createCart,
  deleteCart,
  updateCart,
  getUserCart,
} = require("../controllers/cartController");

router.get("/cart", getCart);
router.get("/cart/:id", getUserCart);
router.post("/cart", createCart);
router.delete("/cart/:id", deleteCart);
router.put("/cart/:id", updateCart);

module.exports = router;
