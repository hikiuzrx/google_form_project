"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
if (accessTokenSecret) {
    console.log(accessTokenSecret);
}
else {
    console.error('Missing environment variable: ACCESS_TOKEN_SECRET');
}
