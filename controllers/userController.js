"use strict";
const bas64 = require("base-64");
const bcrypt = require("bcrypt");
const { users, Op } = require("../models");

const signup = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.body.image
        ? req.body.image
        : req.body.gender === "male"
        ? "https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png"
        : "https://whitneyumc.org/wp-content/uploads/2021/12/istockphoto-1136531172-612x612-1-400x400.jpg",
      password: bcrypt.hashSync(req.body.password, 10),
    };

    const newUser = await users.create(data);
    if (newUser) {
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
    console.log("im here");
    const basicHeaderParts = req.headers.authorization.split(" ");
    console.log("baaaaaaaaa ", basicHeaderParts);
    const encoded = basicHeaderParts.pop();
    const decoded = bas64.decode(encoded);
    const [loginData, password] = decoded.split(":");
    console.log("loginData ", loginData);
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
      if (valid && user.status !== "blocked") {
        if (user.confirmed) {
          return res.status(200).json(user);
        } else {
          return res.status(400).send("Please Verify Your Email!");
        }
      } else {
        return res.status(403).send("Invalid Login This Account Blocked");
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
          res.status(200).json(updatedUser);
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
    const updatUser = await users.update(data, {
      where: { id },
    });
    res.status(200).json(updatUser);
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
      { where: { id } },
      { status: "Blocked" }
    );
    res.status(200).json(userBlocked);
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
};
