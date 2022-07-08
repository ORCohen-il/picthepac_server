"use strict";
const mongoose = require("mongoose");

const express = require("express");
const axios = require("axios");
var router = express.Router();
// var mysql = require("mysql");
var cors = require("cors");
const moment = require("moment");
const loginRouter = require("./routes/Login");
const deliveriesRouter = require("./routes/Deliveries");

// start server-app
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bad Request !");
});

app.use("/login", loginRouter);
app.use("/deliveries", deliveriesRouter);

const port = 3400;

// app-server listen on port 3300
app.listen(port, () => {
  console.log("Server Running on port => " + port);
  // console.log("http://143.47.232.141:" + port + Base);
});

module.exports = app;

// server base url
// const URL = "http://localhost:";
// const Base = "/picthepac";
