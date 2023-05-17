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

const getItems = async (req, res) => {
  try {
    let { category, clothesGender, price } = req.params;
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    const categorylist = ["Pants", "Jacket", "Shoes", "T-shirt", "Other"];

    if (category && !categorylist.includes(category) && isNaN(+category)) {
      console.log("category in the if", category);
      clothesGender = category;
      category = null;
    } else if (!isNaN(+category) && !categorylist.includes(category)) {
      price = category;
      category = null;
    } else if (!isNaN(+clothesGender)) {
      price = clothesGender;
      clothesGender = null;
    }

    console.log(+category);
    console.log("category", category);
    console.log("clothesGender", clothesGender);
    console.log("price", price);
    console.log("typeof", typeof price);
    console.log("page", page);
    console.log("limit", limit);

    // get all items depend on category , clothesGender and price range
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

const getTopSeller = async (req, res) => {
  try {
    // get top seller item depend on number of items sold in cart table and group by itemId

    const topSeller = await carts.findAll({
      where: { status: "paid" },
      group: ["itemId", "Item.id"],
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
              "color",
              "size",
            ],
          },
        },
      ],
      order: [[sequelize.literal("count"), "DESC"]],
      limit: 10,
    });

    res.status(200).json(topSeller);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createItem = async (req, res) => {
  try {
    // create new item in stripe and get the id of this item and save it in our database
    const { title, price, description, image } = req.body;

    const product = await stripe.products.create({
      name: title,
      description: description,
      images: [image],
    });

    const priceStripe = await stripe.prices.create({
      unit_amount: price * 100,
      currency: "usd",
      product: product.id,
    });
    // req.body.priceStripe = priceStripe.id;

    const data = {
      ...req.body,
      priceStripe: priceStripe.id,
    };
    console.log("data", data);

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
