"use strict";

const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const mysql_Schema = require("../models/mysql_Schema");
const resEntity = require("../models/responseModal");

//* method to find emissary by id */
const findEmissary = async (aid) => {
  return new Promise(async (resolve, reject) => {
    await mysql_Schema.emissary
      .findAll({
        where: {
          aid: aid,
        },
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        resolve([]);
      });
  });
};

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

//* response all street by city */
router.get("/subCity?:symbol", async (req, res) => {
  let symbol = req.query.symbol;
  await mysql_Schema.streets
    .findAll({
      attributes: ["name", "symbol_city", "symbol"],
      where: {
        symbol_city: symbol,
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

router
  .get("/emissary?:aid", async (req, res) => {
    let aid = req.query.aid;
    findEmissary(aid)
      .then((data) => {
        res.send(data);
      })
      .catch(() => {
        res.send("");
      });
  })
  .put("/emissary?:aid", async (req, res) => {
    let reqQuery = req.query;
    let reqBody = req.body;
    findEmissary(reqQuery.aid)
      .then(async (data) => {
        let update = {
          name: reqBody.name ? reqBody.name : data.name,
          email: reqBody.email ? reqBody.email : data.email,
          phone: reqBody.phone ? reqBody.phone : data.phone,
          city: reqBody.city ? reqBody.city : data.city,
        };

        await mysql_Schema.emissary
          .update(update, { where: { aid: { [Op.eq]: reqQuery.aid } } })
          .then((results) => {
            res.send(results);
          })
          .catch(() => {
            res.send("");
          });
      })
      .catch(() => {
        res.send("");
      });
  });

router.all("**", (req, res) => {
  res.status(404);
  res.send(resEntity.BAD_REQUEST);
});

module.exports = router;
