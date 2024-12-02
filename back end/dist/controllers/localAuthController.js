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
exports.login = login;
exports.signUp = signUp;
const db_server_1 = require("../utils/db.server");
const credentatilsCheck_1 = require("../utils/credentatilsCheck");
const genToken_1 = require("../utils/genToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('request arrived');
        const userData = req.body;
        console.log(userData);
        console.log("identifier" + userData.identifider);
        try {
            let u = yield db_server_1.db.user.findFirst({
                where: {
                    email: userData.email
                }
            });
            if (!u) {
                u = yield db_server_1.db.user.findFirst({
                    where: {
                        userName: userData.username
                    }
                });
                if (u) {
                    const refreshToken = (0, genToken_1.generateRefreshToken)(u.userId);
                    const accesstoken = (0, genToken_1.generateAcessToken)(u.userId);
                    res.status(200).json({ userExists: true, name: u, email: u.email, refreshToken, accesstoken });
                }
            }
            else {
                console.log(req.body);
                console.log((0, credentatilsCheck_1.isEmailValid)(userData.email));
                if ((0, credentatilsCheck_1.isEmailValid)(userData.email)) {
                    let ps = (0, credentatilsCheck_1.checkPasswordStrength)(userData.password);
                    console.log(ps);
                    if (ps === 'Strong password!') {
                        const salt = yield bcrypt_1.default.genSalt();
                        const hashP = yield bcrypt_1.default.hash(userData.password, salt);
                        u = yield db_server_1.db.user.create({
                            data: {
                                userName: userData.username,
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                email: userData.email,
                                password: hashP
                            }
                        });
                        const refreshToken = (0, genToken_1.generateRefreshToken)(u.userId);
                        const accesstoken = (0, genToken_1.generateAcessToken)(u.userId);
                        res.status(200).json({ register: true, name: u.userName, email: u.email, refreshToken, accesstoken });
                    }
                    else {
                        throw new Error(ps);
                    }
                }
                else {
                    throw new Error('unvalid email');
                }
            }
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ signUp: false, message: error.message });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { identifier, password } = req.body;
        console.log(req.body);
        console.log('request arrived');
        console.log(identifier);
        let u;
        try {
            if (identifier) {
                if ((0, credentatilsCheck_1.isEmailValid)(identifier)) {
                    u = yield db_server_1.db.user.findFirst({
                        where: {
                            email: identifier
                        }
                    });
                }
                else {
                    u = yield db_server_1.db.user.findFirst({
                        where: {
                            userName: identifier
                        }
                    });
                }
            }
            else {
                throw new Error('identifider missing !');
            }
            if (password) {
                if (u) {
                    const auth = yield bcrypt_1.default.compare(password, u.password);
                    console.log(auth);
                    if (auth) {
                        const refreshToken = (0, genToken_1.generateRefreshToken)(u.userId);
                        const accesstoken = (0, genToken_1.generateAcessToken)(u.userId);
                        console.log(refreshToken);
                        /*          res.cookie('jwt',token,{maxAge:60*60*1000}) */
                        res.status(200).json({ email: u.email, name: u.userName, refreshToken, accesstoken });
                    }
                    else {
                        throw new Error('wrong password');
                    }
                }
                else {
                    throw new Error('user not found! wrong email');
                }
            }
            else {
                throw new Error('password required');
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ login: false, message: error });
        }
    });
}
