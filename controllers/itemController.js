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

const getItems = async (req, res) => {
  try {
    let { category, clothesGender, price } = req.params;
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    const categorylist = ["Pants", "Jacket", "Shoes", "T-shirt", "Other"];

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

// const getTopSeller = async (req, res) => {
//   try {
//     // get top seller item depend on number of items sold in cart table and group by itemId

//     const topSeller = await carts.findAll({
//       where: { status: "paid" },
//       group: ["itemId", "Item.id"],
//       attributes: [
//         "itemId",
//         [sequelize.fn("COUNT", sequelize.col("itemId")), "count"],
//       ],
//       include: [
//         {
//           model: items,
//           as: "Item",
//           attributes: {
//             exclude: [
//               "createdAt",
//               "updatedAt",
//               "userId",
//               "category",
//               "clothesGender",
//               "color",
//               "size",
//               "StripeId",
//             ],
//           },
//           include: [
//             {
//               model: reviews,
//               attributes: ["itemId"], // Specify the desired attributes of the review model
//             },
//           ],
//         },
//       ],
//       order: [[sequelize.literal("count"), "DESC"]],
//       limit: 10,
//     });

//     res.status(200).json(topSeller);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

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
              "color",
              "size",
              "StripeId",
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
    res.status(200).json(item);
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
