"use strict";
const router = require("express").Router();
const {
  AllItems,
  getItems,
  getItem,
  getTopSeller,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const bearerAuth = require("../middlewares/bearer-auth");

router.get("/allItems", bearerAuth, AllItems);
router.get("/items/:category/:clothesGender?/:price?", getItems);

router.get("/item/:id", getItem);
router.get("/topSeller", getTopSeller);
router.post("/item", bearerAuth, createItem);
router.delete("/item/:id", bearerAuth, deleteItem);
router.put("/item/:id", bearerAuth, updateItem);

module.exports = router;
