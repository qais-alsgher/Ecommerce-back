"use strict";
const router = require("express").Router();
const bearerAuth = require("../middlewares/bearer-auth");
const {
  getCart,
  getUserOrders,
  createCart,
  deleteCart,
  updateCart,
  getUserCart,
  checkoutCart,
  getAllOrders,
} = require("../controllers/cartController");

router.get("/cart", getCart);
router.get("/cart/:id", getUserCart);
router.get("/cart/orders/:id", getUserOrders);
router.post("/cart", createCart);
router.delete("/cart/:id", deleteCart);
router.put("/cart/:id", updateCart);
router.post("/checkout", checkoutCart);
router.get("/orders", bearerAuth, getAllOrders);

module.exports = router;
