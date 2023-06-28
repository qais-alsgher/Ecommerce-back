"use strict";
const { Sequelize, DataTypes, Op } = require("sequelize");
const GeneralController = require("../collection/general-controller");
require("dotenv").config();

const Postges_URL = process.env.DB_URL || process.env.LOCALE_DB_URL;
const sequelizeOptions = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

// const sequelizeOptions = {};
const db = {};
db.Op = Op;
let sequelize = new Sequelize(Postges_URL, sequelizeOptions);

db.sequelize = sequelize;

// models
db.users = require("./user.model.js")(sequelize, DataTypes);
db.items = require("./item.model.js")(sequelize, DataTypes);
db.reports = require("./report.model.js")(sequelize, DataTypes);
db.carts = require("./cart.model.js")(sequelize, DataTypes);
db.wishlists = require("./wishlist.model.js")(sequelize, DataTypes);
db.reviews = require("./review.model.js")(sequelize, DataTypes);

// controllers
db.userController = new GeneralController(db.users);
db.itemController = new GeneralController(db.items);
db.reportController = new GeneralController(db.reports);
db.cartController = new GeneralController(db.carts);
db.wishlistController = new GeneralController(db.wishlists);
db.reviewController = new GeneralController(db.reviews);

// associations
db.users.hasMany(db.items, { foreignKey: "userId", sourceKey: "id" });
db.items.belongsTo(db.users, { foreignKey: "userId", targetKey: "id" });

db.users.hasMany(db.carts, { foreignKey: "userId", sourceKey: "id" });
db.carts.belongsTo(db.users, { foreignKey: "userId", targetKey: "id" });

db.items.hasMany(db.carts, { foreignKey: "itemId", sourceKey: "id" });
db.carts.belongsTo(db.items, { foreignKey: "itemId", targetKey: "id" });

db.users.hasMany(db.wishlists, { foreignKey: "userId", sourceKey: "id" });
db.wishlists.belongsTo(db.users, { foreignKey: "userId", targetKey: "id" });

db.items.hasMany(db.wishlists, { foreignKey: "itemId", sourceKey: "id" });
db.wishlists.belongsTo(db.items, { foreignKey: "itemId", targetKey: "id" });

db.users.hasMany(db.reports, { foreignKey: "userId", sourceKey: "id" });
db.reports.belongsTo(db.users, { foreignKey: "userId", targetKey: "id" });

db.items.hasMany(db.reports, { foreignKey: "itemId", sourceKey: "id" });
db.reports.belongsTo(db.items, { foreignKey: "itemId", targetKey: "id" });

db.users.hasMany(db.reviews, { foreignKey: "userId", sourceKey: "id" });
db.reviews.belongsTo(db.users, { foreignKey: "userId", targetKey: "id" });

db.items.hasMany(db.reviews, { foreignKey: "itemId", sourceKey: "id" });
db.reviews.belongsTo(db.items, { foreignKey: "itemId", targetKey: "id" });

module.exports = db;
