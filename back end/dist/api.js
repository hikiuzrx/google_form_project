"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const forms_1 = __importDefault(require("./routes/forms"));
(0, dotenv_1.configDotenv)();
const api = (0, express_1.default)();
api.use((0, cors_1.default)());
api.listen(process.env.PORT, () => {
    console.log("it's working");
});
api.use('/forms', forms_1.default);
api.use(express_1.default.json());
api.use((0, cookie_parser_1.default)());
api.use('/auth', auth_1.default);
