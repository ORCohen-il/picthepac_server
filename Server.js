"use strict";

const http = require("http");

const app = require("./App_server");

http.createServer(app);
