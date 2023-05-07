"use strict";
const router = require("express").Router();
const {
  getWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  getUserWishlist,
} = require("../controllers/wishlistController");

router.get("/wishlist", getWishlist);
router.get("/wishlist/:id", getUserWishlist);
router.post("/wishlist", createWishlist);
router.delete("/wishlist/:id", deleteWishlist);
router.put("/wishlist/:id", updateWishlist);

module.exports = router;
