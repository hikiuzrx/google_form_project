"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authValidation_1 = __importDefault(require("../middlewares/authValidation"));
const formsControllers_1 = require("../controllers/formsControllers");
const frouter = express_1.default.Router();
frouter.get('/recent-forms', authValidation_1.default, formsControllers_1.recentForms);
exports.default = frouter;
