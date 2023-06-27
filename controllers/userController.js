"use strict";
const bas64 = require("base-64");
const bcrypt = require("bcrypt");
const { users, Op, sequelize, items, carts } = require("../models");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const signup = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.body.image
        ? req.body.image
        : req.body.gender === "Male"
        ? "https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png"
        : "https://whitneyumc.org/wp-content/uploads/2021/12/istockphoto-1136531172-612x612-1-400x400.jpg",
      password: bcrypt.hashSync(req.body.password, 10),
    };

    const newUser = await users.create(data);
    if (newUser) {
      const accessToken = oauth2Client.getAccessToken();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: newUser.email,
        subject: "Verify Your Email",
        html: `<h5>Hello ${newUser.gender === "Male" ? "Mr." : "Ms."}${
          newUser.userName
        } Please Verify Your Email</h5>
      <p>Click <a href="http://localhost:3000/verify/${
        newUser.id
      }">Here</a> To Verify Your Email</p>`,
      };
      const result = await transporter.sendMail(mailOptions);

      transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
        transporter.close();
      });

      res.status(200).json(newUser);
    } else {
      res.status(400).json("Invalid Data");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const login = async (req, res) => {
  try {
    const basicHeaderParts = req.headers.authorization.split(" ");
    const encoded = basicHeaderParts.pop();
    const decoded = bas64.decode(encoded);
    const [loginData, password] = decoded.split(":");

    const user = await users.findOne({
      where: {
        [Op.or]: [
          { userName: loginData },
          { email: loginData },
          { phoneNumber: loginData },
        ],
      },
    });
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        if (user.status === "Blocked") {
          return res.status(403).send("Invalid Login This Account Blocked");
        } else if (user.confirmed) {
          return res.status(200).json(user);
        } else {
          return res.status(400).send("Please Verify Your Email!");
        }
      } else {
        return res
          .status(403)
          .send("Username Or Password Is Incorrect Please Try Again");
      }
    } else {
      return res.status(403).send("Invalid Login");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const verification = async (req, res) => {
  try {
    const user = await users.findOne({ where: { id: req.params.id } });
    if (user) {
      const basicHeaderParts = req.headers.authorization.split(" ");
      const encoded = basicHeaderParts.pop();
      const decoded = bas64.decode(encoded);
      const [loginData, password] = decoded.split(":");
      const valid = await bcrypt.compare(password, user.password);
      if (
        user.userName === loginData ||
        user.email === loginData ||
        (user.phoneNumber === loginData && valid)
      ) {
        const updatedUser = await user.update({ confirmed: true });
        if (updatedUser) {
          const userVerified = await users.findOne({
            where: { id: req.params.id },
          });
          res.status(200).json(userVerified);
        } else {
          res.status(400).send("Invalid Data");
        }
      } else {
        res.status(403).send("Invalid Login");
      }
    } else {
      res.status(403).send("Invalid Login");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const allUsers = await users.findAll();
    if (allUsers) {
      res.status(200).json(allUsers);
    } else {
      res.status(400).send("Invalid Data");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await users.findOne({ where: { id: req.params.id } });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const userProfileUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    let userUpdatedData = {};
    const updatUser = await users.update(data, {
      where: { id },
    });
    if (updatUser) {
      userUpdatedData = await users.findOne({ where: { id } });
    }
    res.status(202).json(userUpdatedData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUsersActive = async (req, res) => {
  try {
    const usersActive = await users.findAll({ where: { status: "Active" } });
    res.status(200).json(usersActive);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUsersBlocked = async (req, res) => {
  try {
    const usersBlocked = await users.findAll({ where: { status: "Blocked" } });
    res.status(200).json(usersBlocked);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const blockedUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userBlocked = await users.update(
      { status: "Blocked" },
      { where: { id } }
    );
    res.status(200).json(userBlocked);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const activeUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userActive = await users.update(
      { status: "Active" },
      { where: { id } }
    );

    res.status(200).json(userActive);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUserStatistics = async (req, res) => {
  try {
    const usersCount = await users.count();
    const usersActiveCount = await users.count({ where: { status: "Active" } });
    const usersBlockedCount = await users.count({
      where: { status: "Blocked" },
    });
    const usersConfirmedCount = await users.count({
      where: { confirmed: true },
    });
    const usersNotConfirmedCount = await users.count({
      where: { confirmed: false },
    });

    //get number of users for each day in the last month for registration
    const usersPerDay = await users.findAll({
      attributes: [
        [sequelize.fn("date_trunc", "day", sequelize.col("createdAt")), "day"],
        [sequelize.fn("count", sequelize.col("id")), "count"],
      ],
      group: ["day"],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
        },
      },
    });

    res.status(200).json({
      usersCount,
      usersActiveCount,
      usersBlockedCount,
      usersConfirmedCount,
      usersNotConfirmedCount,
      usersPerDay,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getItemStatistics = async (req, res) => {
  try {
    const itemsCount = await items.count();

    const itemsPajamasCount = await items.count({
      where: { category: "Pajamas" },
    });
    const itemsSweatpantsCount = await items.count({
      where: { category: "Sweatpants" },
    });
    const itemsJacketCount = await items.count({
      where: { category: "Jacket" },
    });
    const itemsTshirtCount = await items.count({
      where: { category: "T-shirt" },
    });
    const itemsSneakersCount = await items.count({
      where: { category: "Sneakers" },
    });
    const itemsOtherCount = await items.count({ where: { category: "Other" } });

    const itemsPerDay = await items.findAll({
      attributes: [
        [sequelize.fn("date_trunc", "day", sequelize.col("createdAt")), "day"],
        [sequelize.fn("count", sequelize.col("id")), "count"],
      ],
      group: ["day"],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
        },
      },
    });

    res.status(200).json({
      itemsCount,
      itemsPerDay,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getSalesStatistics = async (req, res) => {
  try {
    const salesCount = await carts.count({ where: { status: "paid" } });
    const itemsCount = await items.count();
    const salesPerDay = await carts.findAll({
      attributes: [
        [sequelize.fn("date_trunc", "day", sequelize.col("createdAt")), "day"],
        [sequelize.fn("count", sequelize.col("id")), "count"],
      ],
      group: ["day"],
      where: {
        [Op.and]: [
          {
            createdAt: {
              [Op.gte]: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
            },
          },
          { status: "paid" },
        ],
      },
    });

    res.status(200).json({
      salesCount,
      itemsCount,
      salesPerDay,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getNumbersStatistics = async (req, res) => {
  try {
    const usersCount = await users.count();
    const itemsCount = await items.count();
    const salesCount = await carts.count({ where: { status: "paid" } });

    res.status(200).json({
      usersCount,
      itemsCount,
      salesCount,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  signup,
  login,
  verification,
  getUsers,
  userProfile,
  userProfileUpdate,
  getUsersActive,
  getUsersBlocked,
  blockedUser,
  activeUser,
  getUserStatistics,
  getItemStatistics,
  getSalesStatistics,
  getNumbersStatistics,
};
