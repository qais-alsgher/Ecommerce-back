"use strict";
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

function start(port) {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

module.exports = {
  start,
  app,
};
