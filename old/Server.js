"use strict";

const http = require("http");

const app = require("./picthepacExpress");

http.createServer(app);
