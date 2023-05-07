"use strict";
require("dotenv").config();
const server = require("./server");
const db = require("./models");

db.sequelize
  .sync()
  .then(() => {
    server.start(process.env.PORT || 8081);
  })
  .catch((err) => {
    console.log(err);
  });

// db.sequelize.sync({ force: true }).then(() => {
//   server.start(process.env.PORT || 8081);
// });
