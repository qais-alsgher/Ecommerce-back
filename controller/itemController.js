"use strict";
const {
  items,
  users,
  carts,
  wishlists,
  reports,
  reviews,
  Op,
  sequelize,
} = require("../models/index.js");

// const { Op } = require("sequelize");
// const { items } = require("../models/index.js");

const getItems = async (req, res) => {
  try {
    const { category, clothesGender, price } = req.params;
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;

    // get all items depend on category , clothesGender and price range
    const whereHandler = {};
    if (category && clothesGender && price) {
      whereHandler = {
        [Op.and]: [
          { category },
          { clothesGender },
          { price: { [Op.lte]: price } },
        ],
      };
    } else if (category && clothesGender) {
      whereHandler = {
        [Op.and]: [{ category }, { clothesGender }],
      };
    } else if (category && price) {
      whereHandler = {
        [Op.and]: [{ category }, { price: { [Op.lte]: price } }],
      };
    } else if (clothesGender && price) {
      whereHandler = {
        [Op.and]: [{ clothesGender }, { price: { [Op.lte]: price } }],
      };
    } else if (category) {
      whereHandler = {
        category,
      };
    } else if (clothesGender) {
      whereHandler = {
        clothesGender,
      };
    } else if (price) {
      whereHandler = {
        price: { [Op.lte]: price },
      };
    }

    const itemsData = await items.findAll({
      where: whereHandler,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      limit: limit,
      offset: offset,
    });
    res.status(200).send(itemsData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getItem = async (req, res) => {
  try {
    const item = await items.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getTopSeller = async (req, res) => {
  try {
    // get top seller items depend on number of purchases in user that bought this item
    const topSeller = await items.findAll({
      group: ["id"],
      attributes: [
        "id",
        "name",
        "image",
        "price",
        "category",
        "clothesGender",
        "description",
        "quantity",
        "createdAt",
        "updatedAt",
        [sequelize.fn("COUNT", sequelize.col("carts.itemId")), "count"],
      ],
      include: [
        {
          model: carts,
          attributes: [],
        },
      ],
      //   order: [[sequelize.literal("count"), "DESC"]],
      order: sequelize.literal("count DESC"),
      limit: 5,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createItem = async (req, res) => {
  try {
    const item = await items.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateItem = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedItem = await items.update(data, {
      where: { id },
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await items.destroy({
      where: { id },
    });
    res.status(204).json(deletedItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getItems,
  getItem,
  getTopSeller,
  createItem,
  updateItem,
  deleteItem,
};
