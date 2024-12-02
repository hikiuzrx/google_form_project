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
const db_server_1 = require("../utils/db.server");
const client_1 = require("@prisma/client");
function getUsers() {
    return [
        {
            firstName: 'Ramzi',
            LastName: 'Gueracha',
            email: 'ramziwassim2004@gmail.com',
            password: 'ramziwassim2',
            method: client_1.RM.Local,
            UserName: 'Hiki'
        },
        {
            firstName: 'hikaro',
            LastName: 'subahiko',
            UserName: 'Mjustice',
            email: 'zch92142@gmail.com',
            method: client_1.RM.Local,
            password: 'hikaro_subahiko*'
        }
    ];
}
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        getUsers().map((user) => __awaiter(this, void 0, void 0, function* () {
            const u = yield db_server_1.db.user.create({
                data: {
                    firstName: user.firstName,
                    lastName: user.LastName,
                    email: user.email,
                    userName: user.UserName,
                    password: user.password
                }
            });
            return u;
        }));
    });
}
seed().then(() => console.log('done'));
