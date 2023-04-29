"use strict";
const router = require("express").Router();
const {
  getItems,
  getItem,
  getTopSeller,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

router.get("/item", getItems);
router.get("/item/:category", getItems);
router.get("/item/:clothesGender", getItems);
router.get("/item/:price", getItems);
router.get("/item/:category/:clothesGender", getItems);
router.get("/item/:category/:price", getItems);
router.get("/item/:clothesGender/:price", getItems);
router.get(
  "/item/:category/:clothesGender/:price",
  getItemByCategoryAndGenderAndPrice
);

router.get("/item/:id", getItem);
router.get("/topSeller", getTopSeller);
router.post("/item", createItem);
router.delete("/item/:id", deleteItem);
router.put("/item/:id", updateItem);
// router for get by category and gender and price range

module.exports = router;
