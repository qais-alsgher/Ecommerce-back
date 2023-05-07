"use strict";
const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user.routes");
const itemRoutes = require("./routes/item.routes");
const reviewRoutes = require("./routes/review.routes");
const reportRoutes = require("./routes/report.routes");
const cartRoutes = require("./routes/cart.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const errorHandler = require("./error-handlers/500");
const pageNotFound = require("./error-handlers/404");

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(itemRoutes);
app.use(reviewRoutes);
app.use(reportRoutes);
app.use(cartRoutes);
app.use(wishlistRoutes);

function start(port) {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

app.use(errorHandler);
app.use(pageNotFound);

module.exports = {
  start,
  app,
};
