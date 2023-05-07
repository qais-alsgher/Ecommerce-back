"use strict";

module.exports = (req, res, next) => {
  res.status(404).send({
    code: 404,
    massage: "Page Not Found",
  });
};
