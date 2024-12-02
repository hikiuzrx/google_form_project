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
const semver_1 = __importDefault(require("semver"));
const cache_1 = require("./cache");
const getDistVersion_1 = __importDefault(require("./getDistVersion"));
const hasNewVersion = (_a) => __awaiter(void 0, [_a], void 0, function* ({ pkg, updateCheckInterval = 1000 * 60 * 60 * 24, distTag = 'latest', alwaysRun, debug, }) {
    (0, cache_1.createConfigDir)();
    const lastUpdateCheck = (0, cache_1.getLastUpdate)(pkg.name);
    if (alwaysRun ||
        !lastUpdateCheck ||
        lastUpdateCheck < new Date().getTime() - updateCheckInterval) {
        const latestVersion = yield (0, getDistVersion_1.default)(pkg.name, distTag);
        (0, cache_1.saveLastUpdate)(pkg.name);
        if (semver_1.default.gt(latestVersion, pkg.version)) {
            return latestVersion;
        }
        else if (debug) {
            console.error(`Latest version (${latestVersion}) not newer than current version (${pkg.version})`);
        }
    }
    else if (debug) {
        console.error(`Too recent to check for a new update. simpleUpdateNotifier() interval set to ${updateCheckInterval}ms but only ${new Date().getTime() - lastUpdateCheck}ms since last check.`);
    }
    return false;
});
exports.default = hasNewVersion;
