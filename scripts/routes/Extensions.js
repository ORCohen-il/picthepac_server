const express = require("express");
const router = express.Router();
const mysql_Schema = require("../models/mysql_Schema");

router.get("/cities", async (req, res) => {
  await mysql_Schema.cities
    .findAll({
      attributes: ["name", "name_eng", "symbol"],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/streets", async (req, res) => {
  await mysql_Schema.streets
    .findAll({
      attributes: ["name", "symbol_city"],
    })
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/subCity?:cid", async (req, res) => {
  let cid = req.query.cid;
  await mysql_Schema.streets
    .findAll({
      attributes: ["name", "symbol_city", "symbol"],
      where: {
        symbol_city: cid,
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
