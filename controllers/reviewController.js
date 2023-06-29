"use strict";
const { reviews, reviewController, users, items } = require("../models");

const getReview = async (req, res) => {
  try {
    const id = req.params.id;
    const review = await reviewController.read(id);
    res.status(200).send(review);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getItemReview = async (req, res) => {
  try {
    const itemId = req.params.id;
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
    const review = await reviews.findAll({
      where: { itemId: itemId },
      attributes: { exclude: ["createdAt", "updatedAt", "userId", "itemId"] },
      include: [
        {
          model: users,
          attributes: { exclude: excludedAttributes },
        },
      ],
    });
    res.status(200).send(review);
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
};

const createReview = async (req, res) => {
  try {
    const isReviewed = await reviews.findOne({
      where: { userId: req.body.userId, itemId: req.body.itemId },
    });

    if (isReviewed) {
      res.status(400).send("You have already reviewed this item");
    } else {
      const review = await reviewController.create(req.body);
      res.status(201).send(review);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await reviewController.update(id, req.body);
    const review = await reviewController.read(id);
    res.status(204).send(review);
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await reviewController.delete(id);
    res.status(204).send("Deleted");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getReview,
  getItemReview,
  createReview,
  deleteReview,
  updateReview,
};
