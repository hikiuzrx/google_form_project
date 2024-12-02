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
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genToken_1 = require("../utils/genToken");
(0, dotenv_1.configDotenv)();
const authValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('we are in the middlwere');
    const authorizationHeader = req.headers.authorization;
    // Check if Authorization header exists
    if (!authorizationHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    // Check for the expected format (Bearer <token>)
    if (!authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }
    // Extract the token from the header
    let accesstoken = authorizationHeader.substring(7); // Remove "Bearer " from the start of the string
    // Verify the JWT token
    let secret = process.env.ACESS_TOKEN_SECRET;
    console.log(secret);
    if (accesstoken) {
        if (secret) {
            jsonwebtoken_1.default.verify(accesstoken, secret, (err, user) => {
                if (err) {
                    secret = process.env.REFRESH_TOKEN_SECRET;
                    let { refreshToken } = req.body;
                    if (!refreshToken) {
                        res.status(401).json({ sucess: false, message: 'no refreshToken provided' });
                    }
                    else {
                        jsonwebtoken_1.default.verify(refreshToken, secret, (err, user) => {
                            if (err) {
                                res.status(401).json({ sucess: false, message: 'unvalid refresh token' });
                            }
                            else {
                                req.userId = user.userId;
                                refreshToken = (0, genToken_1.generateRefreshToken)((typeof user.userId === 'number') ? user.userId : parseInt(user.userId));
                                accesstoken = (0, genToken_1.generateAcessToken)((typeof user.userId === 'number') ? user.userId : parseInt(user.userId));
                                req.refreshToken = refreshToken;
                                req.accessToken = accesstoken;
                                next();
                            }
                        });
                    }
                }
                else {
                    req.userId = user.userId;
                    const refreshToken = (0, genToken_1.generateRefreshToken)((typeof user.userId === 'number') ? user.userId : parseInt(user.userId));
                    accesstoken = (0, genToken_1.generateAcessToken)((typeof user.userId === 'number') ? user.userId : parseInt(user.userId));
                    req.refreshToken = refreshToken;
                    req.accessToken = accesstoken;
                    next();
                }
            });
            next();
        }
        // Handle JWT verification errors
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
});
exports.default = authValidator;
