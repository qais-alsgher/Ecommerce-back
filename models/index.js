"use strict";
const { Sequelize, DataTypes, Op } = require("sequelize");
require("dotenv").config();

const Postges_URL = process.env.DB_URL || process.env.LOCALE_DB_URL;
// const sequelizeOptions = {
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// };

const sequelizeOptions = {};
const db = {};

let sequelize = new Sequelize(Postges_URL, sequelizeOptions);

db.sequelize = sequelize;

// models
db.users = require("./user.model.js")(sequelize, DataTypes);
db.items = require("./item.model.js")(sequelize, DataTypes);
db.reports = require("./report.model.js")(sequelize, DataTypes);
db.carts = require("./cart.model.js")(sequelize, DataTypes);
db.wishlists = require("./wishlist.model.js")(sequelize, DataTypes);
db.reviews = require("./review.model.js")(sequelize, DataTypes);

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
