"use strict";
const router = require("express").Router();
const bearerAuth = require("../middlewares/bearer-auth");
const basicAuth = require("../middlewares/basic-auth");
const permissions = require("../middlewares/acl");

router.post("/signup", basicAuth, singnup);
router.post("/login", bearerAuth, login);
router.get("/users", bearerAuth, permissions("read"), getUsers);
router, post("/verification/:token", verification);
