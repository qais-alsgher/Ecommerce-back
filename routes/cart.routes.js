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
const acl = require("../middlewares/acl");

router.get("/cart", bearerAuth, getCart);
router.get("/cart/:id", bearerAuth, getUserCart);
router.get("/cart/orders/:id", bearerAuth, getUserOrders);
router.post("/cart", bearerAuth, createCart);
router.delete("/cart/:id", bearerAuth, deleteCart);
router.put("/cart/:id", bearerAuth, updateCart);
router.post("/checkout", checkoutCart);
router.get("/orders", bearerAuth, acl, getAllOrders);

module.exports = router;
