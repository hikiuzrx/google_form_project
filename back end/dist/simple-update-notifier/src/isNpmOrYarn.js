"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const packageJson = process_1.default.env.npm_package_json;
const userAgent = process_1.default.env.npm_config_user_agent;
const isNpm6 = Boolean(userAgent && userAgent.startsWith('npm'));
const isNpm7 = Boolean(packageJson && packageJson.endsWith('package.json'));
const isNpm = isNpm6 || isNpm7;
const isYarn = Boolean(userAgent && userAgent.startsWith('yarn'));
const isNpmOrYarn = isNpm || isYarn;
exports.default = isNpmOrYarn;
