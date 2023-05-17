"use strict";
const { carts, cartController, items, Op } = require("../models");

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
      res.status(201).send(updatedCart);
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
    res.status(204).send(updated);
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getCart,
  getUserOrders,
  createCart,
  deleteCart,
  updateCart,
  getUserCart,
};
