"use strict";

module.exports = (err, req, res, next) => {
  res.status(500).send({
    code: 500,
    massage: `Server Error: ${err.message || err}`,
  });
};
