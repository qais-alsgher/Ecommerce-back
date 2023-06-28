"use strict";
const { reports, reportController, users, items } = require("../models");
const excludedAttributes = [
  "password",
  "email",
  "role",
  "createdAt",
  "updatedAt",
  "token",
  "phoneNumber",
  "address",
  "confirmed",
  "birhDate",
  "gender",
  "status",
];

const getReport = async (req, res) => {
  try {
    const id = req.params.id;
    const report = await reportController.read(id);
    res.status(200).send(report);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getItemsReport = async (req, res) => {
  try {
    const itemsRepoted = await items.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: reports,
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "itemId"],
          },
          include: [
            {
              model: users,
              attributes: { exclude: excludedAttributes },
            },
          ],
        },
      ],
    });
    res.status(200).send(itemsRepoted);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving items report.",
    });
  }
};

const getUsersReport = async (req, res) => {
  try {
    const usersRepoted = await users.findAll({
      attributes: { exclude: excludedAttributes },
      include: [
        {
          model: reports,
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "itemId"],
          },
          include: [
            {
              model: items,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
    res.status(200).send(usersRepoted);
  } catch (error) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users report.",
    });
  }
};
const createReport = async (req, res) => {
  try {
    const report = await reportController.create(req.body);
    res.status(201).send(report);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the report.",
    });
  }
};

const updateReport = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await reportController.update(id, req.body);
    const report = await reportController.read(id);
    res.status(204).send(report);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating the report.",
    });
  }
};

const deleteReport = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await reportController.delete(id);
    res.status(204).send("Deleted");
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while deleting the report.",
    });
  }
};

module.exports = {
  getReport,
  getItemsReport,
  createReport,
  updateReport,
  deleteReport,
  getUsersReport,
};
