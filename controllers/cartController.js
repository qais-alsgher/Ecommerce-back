"use strict";
const { carts, cartController, items, Op, users } = require("../models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getCart = async (req, res) => {
  try {
    const id = req.params.id;
    const cart = await cartController.read(id);
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await carts.findAll({
      where: {
        [Op.and]: [{ userId }, { status: "pending" }],
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: items,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    res.status(200).send(cart);
  } catch (error) {}
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await carts.findAll({
      where: {
        [Op.and]: [{ userId }, { status: "paid" }],
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: items,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const dtat = req.body;
    const cart = await carts.findOne({
      where: {
        [Op.and]: [
          { userId: dtat.userId },
          { itemId: dtat.itemId },
          { color: dtat.color },
          { size: dtat.size },
        ],
      },
    });
    if (cart && cart.status === "pending") {
      const updatedCart = await cartController.update(cart.id, {
        quantity: cart.quantity + dtat.quantity,
      });
      const updated = await cartController.read(cart.id);
      res.status(201).send(updated);
    } else {
      const newCart = await cartController.create(req.body);
      res.status(201).send(newCart);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await cartController.delete(id);
    res.status(204).send("Deleted");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await cartController.update(id, req.body);
    const updatedCart = await cartController.read(id);
    res.status(204).send(updatedCart);
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const lineItems = req.body.carts;
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/Success",
      cancel_url: "http://localhost:3000/Cart",
    });
    res.status(200).send(JSON.stringify({ url: session.url }));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await carts.findAll({
      where: {
        status: "paid",
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: items,
          attributes: { exclude: ["createdAt", "updatedAt", "StripeId"] },
        },
        {
          model: users,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "gender",
              "confirmed",
              "image",
              "role",
              "birthDate",
              "status",
            ],
          },
        },
      ],
    });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getCart,
  getUserOrders,
  createCart,
  deleteCart,
  updateCart,
  getUserCart,
  checkoutCart,
  getAllOrders,
};
