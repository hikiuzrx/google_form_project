"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLastUpdate = exports.getLastUpdate = exports.createConfigDir = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const homeDirectory = os_1.default.homedir();
const configDir = process.env.XDG_CONFIG_HOME ||
    path_1.default.join(homeDirectory, '.config', 'simple-update-notifier');
const getConfigFile = (packageName) => {
    return path_1.default.join(configDir, `${packageName.replace('@', '').replace('/', '__')}.json`);
};
const createConfigDir = () => {
    if (!fs_1.default.existsSync(configDir)) {
        fs_1.default.mkdirSync(configDir, { recursive: true });
    }
};
exports.createConfigDir = createConfigDir;
const getLastUpdate = (packageName) => {
    const configFile = getConfigFile(packageName);
    try {
        if (!fs_1.default.existsSync(configFile)) {
            return undefined;
        }
        const file = JSON.parse(fs_1.default.readFileSync(configFile, 'utf8'));
        return file.lastUpdateCheck;
    }
    catch (_a) {
        return undefined;
    }
};
exports.getLastUpdate = getLastUpdate;
const saveLastUpdate = (packageName) => {
    const configFile = getConfigFile(packageName);
    fs_1.default.writeFileSync(configFile, JSON.stringify({ lastUpdateCheck: new Date().getTime() }));
};
exports.saveLastUpdate = saveLastUpdate;
