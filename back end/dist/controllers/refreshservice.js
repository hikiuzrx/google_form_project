"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genToken_1 = require("../utils/genToken");
const db_server_1 = require("../utils/db.server");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const getRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    // Check for the expected format (Bearer <token>)
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }
    // Extract the token from the header
    const Refreshtoken = authHeader.substring(7); // Remove "Bearer " from the start of the string
    try {
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        if (refreshSecret) {
            const decoded = jsonwebtoken_1.default.verify(refreshSecret, Refreshtoken);
            if ((typeof decoded === 'object') && ("id" in decoded)) {
                const { id } = decoded;
                const user = yield db_server_1.db.user.findFirst({
                    where: {
                        userId: (typeof id === 'string') ? parseInt(id) : id
                    }
                });
                if (!user) {
                    throw new Error('user not found ');
                }
                else {
                    const newRefreshToken = (0, genToken_1.generateRefreshToken)(user.userId);
                    const newAccessToken = (0, genToken_1.generateAcessToken)(user.userId);
                    res.status(200).json({ sucess: true, refreshToken: newRefreshToken, AccessToken: newAccessToken });
                }
            }
        }
        else {
            throw new Error("env variables didn't load");
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).json({ success: false, message: `couldn't refresh the token reason :${error.message}` });
    }
});
exports.default = getRefreshToken;
