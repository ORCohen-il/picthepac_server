"use strict";
const express = require("express");
var cors = require("cors");
const loginRouter = require("./scripts/routes/Login");
const deliveriesRouter = require("./scripts/routes/Deliveries");
const mongo_Schema = require("./scripts/models/mongo_Schema");
const global = require("./scripts/routes/global");
const Token = require("./scripts/models/Token");
const moment = require("moment");
const db = require("./scripts/config/database-sql");
// start server-app
const newGlobal = new global();
let ResToken = new Token();

newGlobal.GenerateNewGlobal("http://localhost:", 3400, "/");
const app = express();
app.use(cors());
app.use(express.json());

app.get((req, res) => {
  res.send("Bad Request !");
});
app.get("/", (req, res) => {
  res.send("Bad Request !");
});

// console.log(async () => mongoConnect);

app.use("/login", loginRouter);

// check token before send response
const token_chk = async (req, res, next) => {
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
      res.send(ResToken);
    }
  } else {
    res.send("token Expired or not valid");
    return;
  }
};

app.use(token_chk);

app.use("/deliveries", deliveriesRouter);

// app-server listen
app.listen(newGlobal.port, async (err) => {
  if (err) console.log(err);
  console.log("Server Running on port => " + newGlobal.port);
  await db
    .connect_valid()
    .then(() => console.log("Mysql Connection has been established successfully"))
    .catch((err) => {
      throw console.log("Mysql connect Eror");
    });
  // console.log("http://143.47.232.141:" + port + Base);
});

module.exports = app;
