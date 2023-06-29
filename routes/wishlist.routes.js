"use strict";
const router = require("express").Router();
const {
  getWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  getUserWishlist,
} = require("../controllers/wishlistController");
const bearerAuth = require("../middlewares/bearer-auth");

router.get("/wishlist", bearerAuth, getWishlist);
router.get("/wishlist/:id", bearerAuth, getUserWishlist);
router.post("/wishlist", bearerAuth, createWishlist);
router.delete("/wishlist/:id", bearerAuth, deleteWishlist);
router.put("/wishlist/:id", bearerAuth, updateWishlist);

module.exports = router;
