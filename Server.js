"use strict";

const http = require("http");

const app = require("./ServerExp");

http.createServer(app);
