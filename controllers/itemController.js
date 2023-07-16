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
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// for getting all items
const AllItems = async (req, res) => {
  try {
    const allItems = await items.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });
    res.status(200).json(allItems);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// for getting all items by filter and page number and limit
// get all items depend on category , clothesGender and price range
const getItems = async (req, res) => {
  try {
    let { category, clothesGender, price } = req.params;
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    const categorylist = [
      "Pajamas",
      "Sweatpants",
      "Jacket",
      "T-shirt",
      "Sneakers",
      "Other",
    ];

    // if category is not in category list and not a number
    if (category && !categorylist.includes(category) && isNaN(+category)) {
      clothesGender = category;
      category = null;
    } else if (!isNaN(+category) && !categorylist.includes(category)) {
      price = category;
      category = null;
    } else if (!isNaN(+clothesGender)) {
      price = clothesGender;
      clothesGender = null;
    }

    // opject to handle where condition about category , clothesGender and price
    let whereHandler = {};
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

    // get all items depend on where condition and limit and offset
    const itemsData = await items.findAll({
      where: whereHandler,
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "userId",
          "category",
          "clothesGender",
        ],
      },
      include: [
        {
          model: reviews,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "itemId",
              "userId",
              "reviewMessage",
            ],
          },
        },
      ],
      order: [["id", "DESC"]],

      limit: limit,
      offset: offset,
    });
    res.status(200).send(itemsData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// for getting one item by id with reviews and user data
const getItem = async (req, res) => {
  try {
    const item = await items.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: reviews,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: users,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// for getting top seller items
const getTopSeller = async (req, res) => {
  try {
    const topSeller = await carts.findAll({
      where: { status: "paid" },
      attributes: [
        "itemId",
        [sequelize.fn("COUNT", sequelize.col("itemId")), "count"],
      ],
      include: [
        {
          model: items,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "userId",
              "category",
              "clothesGender",
            ],
          },
          include: [
            {
              model: reviews,
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "id",
                  "itemId",
                  "userId",
                  "reviewMessage",
                ],
              },
            },
          ],
        },
      ],
      group: ["itemId", "Cart.id"],
      order: [[sequelize.literal("count"), "DESC"]],
      limit: 10,
    });

    res.status(200).json(topSeller);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// for creating new item
const createItem = async (req, res) => {
  try {
    const { title, price, description, image } = req.body;

    const product = await stripe.products.create({
      name: title,
      description: description,
      images: image ? [...image] : [image],
    });

    const priceStripe = await stripe.prices.create({
      unit_amount: price * 100,
      currency: "usd",
      product: product.id,
    });

    const data = {
      ...req.body,
      StripeId: priceStripe.id,
    };

    const item = await items.create(data);
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
    const item = await items.findOne({ where: { id } });
    res.status(204).json(item);
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
  AllItems,
  getItems,
  getItem,
  getTopSeller,
  createItem,
  updateItem,
  deleteItem,
};
