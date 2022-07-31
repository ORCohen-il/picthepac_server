const express = require("express");
const router = express.Router();
var mysql = require("mysql");
const mongo_Schema = require("../models/mongo_Schema");
const Token = require("../models/Token");
const moment = require("moment");

let ResToken = new Token();

//  restApi Method -> generate new Token
const generatorToken = async (login) => {
  return new Promise(async (resolve, reject) => {
    let uuid_token = await mongo_Schema.newToken();
    let token = new mongo_Schema.Auth({
      aid: login.aid,
      email: login.email,
      name: login.name,
      token: uuid_token,
      date_created: moment().format("YYYY-MM-DD HH:MM"),
      date_end: moment().add(6, "hours").format("YYYY-MM-DD HH:MM"),
      valid: true,
    });
    token
      .save()
      .then(() => {
        resolve(uuid_token);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// restApi Method -> login
router.post("/", async (req, res) => {
  ResToken.GenerateNewToken(req.body.name, req.body.email, req.body.password, false);
  if (ResToken.email != undefined && ResToken.password != undefined) {
    await mongo_Schema.User.find({ email: `${ResToken.email}`, password: `${ResToken.password}` })
      .then(async (result) => {
        if (result.length != 0) {
          let token = await generatorToken(result[0]);
          let aid = result[0].aid;
          ResToken.SetToken(token, true);
          ResToken.SetAid(aid);
          res.send(ResToken);
        } else {
          ResToken.SetMassage("The username or password is incorrect");
          res.send(ResToken);
        }
      })
      .catch((err) => res.send(err));
  } else {
    ResToken.SetMassage("missing params");
    res.send(ResToken);
  }
});

// restApi Method -> validToken
router.post("/cvt?:token", async (req, res) => {
  let details = { token: req.query.token };

  mongo_Schema.Auth.findOne(details)
    .then((response) => {
      if (response != null) {
        let time = moment().format("YYYY-MM-DD HH:MM");
        let token_expired = moment(response.date_end).format("YYYY-MM-DD HH:MM");
        let time_valid = moment(time).isBefore(moment(token_expired));

        if (time_valid && response.valid != false) {
          ResToken.GenerateNewToken(response.name, response.email, "XXXXXXXXX", true, response.token, "Token Valid");
          res.send(ResToken);
        } else {
          ResToken.SetMassage("Token Invalid");
          ResToken.SetToken("XXXXXXXXXX", false);
          res.send(ResToken);
        }
      } else {
        ResToken.SetMassage("Token Invalid");
        ResToken.SetToken("", false);
        res.send(ResToken);
      }
    })
    .catch((e) => {
      res.send(e.message);
    });
});

// restApi Method -> remove token
router.delete("/", async (req, res) => {
  const filter = { token: req.body.token };
  const update = { valid: false };
  mongo_Schema.Auth.findOneAndUpdate(filter, update, {
    new: true,
  })
    .then((response) => {
      ResToken.SetMassage("Token Update");
      res.send(ResToken);
    })
    .catch((e) => {
      res.send(e.message);
    });
});

module.exports = router;
