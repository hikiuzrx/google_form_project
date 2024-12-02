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
const isNpmOrYarn_1 = __importDefault(require("./isNpmOrYarn"));
const hasNewVersion_1 = __importDefault(require("./hasNewVersion"));
const borderedText_1 = __importDefault(require("./borderedText"));
const simpleUpdateNotifier = (args) => __awaiter(void 0, void 0, void 0, function* () {
    if (!args.alwaysRun &&
        (!process.stdout.isTTY || (isNpmOrYarn_1.default && !args.shouldNotifyInNpmScript))) {
        if (args.debug) {
            console.error('Opting out of running simpleUpdateNotifier()');
        }
        return;
    }
    try {
        const latestVersion = yield (0, hasNewVersion_1.default)(args);
        if (latestVersion) {
            console.error((0, borderedText_1.default)(`New version of ${args.pkg.name} available!
Current Version: ${args.pkg.version}
Latest Version: ${latestVersion}`));
        }
    }
    catch (err) {
        // Catch any network errors or cache writing errors so module doesn't cause a crash
        if (args.debug && err instanceof Error) {
            console.error('Unexpected error in simpleUpdateNotifier():', err);
        }
    }
});
exports.default = simpleUpdateNotifier;
