"use strict";
const { wishlists, wishlistController, users, items } = require("../models");

const getWishlist = async (req, res) => {
  try {
    const id = req.params.id;
    const wishlist = await wishlistController.read(id);
    res.status(200).send(wishlist);
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
};

const getUserWishlist = async (req, res) => {
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

    const wishlist = await wishlists.findAll({
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
    res.status(200).send(wishlist);
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
};

const createWishlist = async (req, res) => {
  try {
    const data = req.body;
    const wishlistExist = await wishlists.findOne({
      where: { userId: data.userId, itemId: data.itemId },
    });

    if (wishlistExist) {
      res.status(400).json("The item already exists in favorite list");
    } else {
      const wishlist = await wishlistController.create(req.body);
      res.status(201).send(wishlist);
    }
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
};

const updateWishlist = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await wishlistController.update({
      where: { id },
      data: req.body,
    });
    const updatedWishItem = await wishlistController.read(id);
    res.status(202).send(updatedWishItem);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteWishlist = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await wishlistController.delete(id);
    res.status(204).send("Deleted");
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  getUserWishlist,
};
