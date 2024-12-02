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
const https_1 = __importDefault(require("https"));
const getDistVersion = (packageName, distTag) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://registry.npmjs.org/-/package/${packageName}/dist-tags`;
    return new Promise((resolve, reject) => {
        https_1.default
            .get(url, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    const version = json[distTag];
                    if (!version) {
                        reject(new Error('Error getting version'));
                    }
                    resolve(version);
                }
                catch (_a) {
                    reject(new Error('Could not parse version response'));
                }
            });
        })
            .on('error', (err) => reject(err));
    });
});
exports.default = getDistVersion;
