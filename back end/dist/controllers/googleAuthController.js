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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glogin = login;
const db_server_1 = require("../utils/db.server");
const client_1 = require("@prisma/client");
const credentatilsCheck_1 = require("../utils/credentatilsCheck");
const genToken_1 = require("../utils/genToken");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email; // No need for 'as string' if you validate below
        console.log('request arrived');
        console.log(req.body);
        try {
            if (typeof email === 'string' && email.trim() !== '') {
                let user = yield db_server_1.db.user.findFirst({
                    where: {
                        email: email,
                    }
                });
                console.log('user found :\n' + user);
                if (!user) {
                    // Create a new user if one doesn't exist
                    const newUser = yield db_server_1.db.user.create({
                        data: {
                            email,
                            userName: req.body.username, // Assuming name is passed in the body
                            method: client_1.RM.Google,
                            password: (0, credentatilsCheck_1.generateRandomPassword)(),
                        }
                    });
                    if (newUser) {
                        console.log(' login sucess');
                        const accesstoken = (0, genToken_1.generateAcessToken)(newUser.userId);
                        const refreshToken = (0, genToken_1.generateRefreshToken)(newUser.userId);
                        return res.status(200).json({ success: true, email: newUser.email, name: newUser.userName, refreshToken, accesstoken });
                    }
                }
                else {
                    console.log(' login sucess'); // User exists
                    const accesstoken = (0, genToken_1.generateAcessToken)(user.userId);
                    const refreshToken = (0, genToken_1.generateRefreshToken)(user.userId);
                    return res.status(200).json({ success: true, email: user.email, name: user.userName, refreshToken, accesstoken });
                }
            }
            else {
                throw new Error('Invalid email');
            }
        }
        catch (error) {
            // Return a user-friendly message
            const errorMessage = error instanceof Error ? error.message : 'Internal server error';
            console.log(' login fail');
            return res.status(401).json({ success: false, message: errorMessage });
        }
    });
}
