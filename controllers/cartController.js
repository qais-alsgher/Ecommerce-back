"use strict";
const { carts, cartController, items, users } = require("../models");

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
    const excludedAttributes = [
      "password",
      "email",
      "role",
      "createdAt",
      "updatedAt",
      "token",
      "phoneNumber",
      "gender",
      "address",
      "confirmed",
      "birhDate",
    ];
    const cart = await carts.findAll({
      where: { userId: userId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: items,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: users,
          attributes: { exclude: excludedAttributes },
        },
      ],
    });
    res.status(200).send(cart);
  } catch (error) {}
};

const createCart = async (req, res) => {
  try {
    const dtat = req.body;
    const cart = await carts.findOne({
      where: { userId: dtat.userId, itemId: dtat.itemId },
    });
    if (cart) {
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
  createCart,
  deleteCart,
  updateCart,
  getUserCart,
};
