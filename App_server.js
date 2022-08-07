"use strict";
const express = require("express");
var cors = require("cors");
const moment = require("moment");

//* all Modals */

const extensionsRouter = require("./scripts/routes/extensions");
const mongo_Schema = require("./scripts/models/mongo_Schema");
const db = require("./scripts/config/database-sql");
const Token = require("./scripts/models/tokenModal");
const global = require("./scripts/global/global");
const RES_ENTITY = require("./scripts/models/responseModal");

//* server router */
const loginRouter = require("./scripts/routes/Login");
const deliveriesRouter = require("./scripts/routes/deliveries");

//* server config */
const newGlobal = new global();
const app = express();
let ResToken = new Token();

newGlobal.GenerateNewGlobal("http://localhost:", 3400, "/");
app.use(cors());
app.use(express.json());

/** ---------------------------------------------------------------------- */

app.all("/", (req, res) => {
  res.status(404);
  res.send(RES_ENTITY.BAD_REQUEST);
});

app.use("/login", loginRouter);

/** check token before send response */
const token_chk = async (req, res, next) => {
  // console.log(req.query);
  const response = await mongo_Schema.Auth.findOne({ token: req.query.token });
  if (response != null) {
    let time = moment().format("YYYY-MM-DD HH:MM");
    let token_expired = moment(response.date_end).format("YYYY-MM-DD HH:MM");
    let time_valid = moment(time).isBefore(moment(token_expired));
    // console.log(`${time} === ${token_expired}`);

    if (time_valid && response.valid != false) {
      next();
      return;
    } else {
      mongo_Schema.Auth.findOneAndUpdate({ token: req.query.token }, { valid: false }, (err, docs) => {
        if (err) console.log(err);
      });
      ResToken.SetMassage("Token Expired or not valid");
      ResToken.SetToken("XXXXXXXXXX", false);
      ResToken.SetData([]);
      res.send(ResToken);
    }
  } else {
    ResToken.SetMassage("Token Expired or not valid");
    ResToken.SetToken("XXXXXXXXXX", false);
    ResToken.SetData([]);
    res.send(ResToken);
    return;
  }
};

app.use(token_chk);

app.use("/extensions", extensionsRouter);

app.use("/deliveries", deliveriesRouter);

app.listen(newGlobal.port, async (err) => {
  if (err) console.log(err);
  console.log("Server Running on port => " + newGlobal.port);
  await db
    .connect_valid()
    .then(() => console.log("Mysql Connection has been established successfully"))
    .catch((err) => {
      throw console.log("Mysql connect Eror");
    });
});

module.exports = app;

// console.log(async () => mongoConnect);

// app
//   .get("/", (req, res) => {
//     res.status(404);
//     res.send(RES_ENTITY.BAD_REQUEST);
//     // throw new Error("BROKEN"); // Express will catch this on its own.
//   })
//   .post("/", (req, res) => {
//     res.status(404);
//     res.send(RES_ENTITY.BAD_REQUEST);
//   });
