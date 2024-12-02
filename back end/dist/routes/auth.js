"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const localAuthController_1 = require("../controllers/localAuthController");
const googleAuthController_1 = require("../controllers/googleAuthController");
const express_1 = __importDefault(require("express"));
const refreshservice_1 = __importDefault(require("../controllers/refreshservice"));
let authR = express_1.default.Router();
authR.post('/local/register', localAuthController_1.signUp);
authR.post('/local/login', localAuthController_1.login);
authR.post('/google/login', googleAuthController_1.Glogin);
authR.get('/get-refresh', refreshservice_1.default);
exports.default = authR;
