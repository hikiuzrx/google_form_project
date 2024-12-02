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
const hasNewVersion_1 = __importDefault(require("./hasNewVersion"));
const cache_1 = require("./cache");
const getDistVersion_1 = __importDefault(require("./getDistVersion"));
jest.mock('./getDistVersion', () => jest.fn().mockReturnValue('1.0.0'));
jest.mock('./cache', () => ({
    getLastUpdate: jest.fn().mockReturnValue(undefined),
    createConfigDir: jest.fn(),
    saveLastUpdate: jest.fn(),
}));
const pkg = { name: 'test', version: '1.0.0' };
afterEach(() => jest.clearAllMocks());
const defaultArgs = {
    pkg,
    shouldNotifyInNpmScript: true,
    alwaysRun: true,
};
test('it should not trigger update for same version', () => __awaiter(void 0, void 0, void 0, function* () {
    const newVersion = yield (0, hasNewVersion_1.default)(defaultArgs);
    expect(newVersion).toBe(false);
}));
test('it should trigger update for patch version bump', () => __awaiter(void 0, void 0, void 0, function* () {
    getDistVersion_1.default.mockReturnValue('1.0.1');
    const newVersion = yield (0, hasNewVersion_1.default)(defaultArgs);
    expect(newVersion).toBe('1.0.1');
}));
test('it should trigger update for minor version bump', () => __awaiter(void 0, void 0, void 0, function* () {
    getDistVersion_1.default.mockReturnValue('1.1.0');
    const newVersion = yield (0, hasNewVersion_1.default)(defaultArgs);
    expect(newVersion).toBe('1.1.0');
}));
test('it should trigger update for major version bump', () => __awaiter(void 0, void 0, void 0, function* () {
    getDistVersion_1.default.mockReturnValue('2.0.0');
    const newVersion = yield (0, hasNewVersion_1.default)(defaultArgs);
    expect(newVersion).toBe('2.0.0');
}));
test('it should not trigger update if version is lower', () => __awaiter(void 0, void 0, void 0, function* () {
    getDistVersion_1.default.mockReturnValue('0.0.9');
    const newVersion = yield (0, hasNewVersion_1.default)(defaultArgs);
    expect(newVersion).toBe(false);
}));
it('should trigger update check if last update older than config', () => __awaiter(void 0, void 0, void 0, function* () {
    const TWO_WEEKS = new Date().getTime() - 1000 * 60 * 60 * 24 * 14;
    cache_1.getLastUpdate.mockReturnValue(TWO_WEEKS);
    const newVersion = yield (0, hasNewVersion_1.default)({
        pkg,
        shouldNotifyInNpmScript: true,
    });
    expect(newVersion).toBe(false);
    expect(getDistVersion_1.default).toHaveBeenCalled();
}));
it('should not trigger update check if last update is too recent', () => __awaiter(void 0, void 0, void 0, function* () {
    const TWELVE_HOURS = new Date().getTime() - 1000 * 60 * 60 * 12;
    cache_1.getLastUpdate.mockReturnValue(TWELVE_HOURS);
    const newVersion = yield (0, hasNewVersion_1.default)({
        pkg,
        shouldNotifyInNpmScript: true,
    });
    expect(newVersion).toBe(false);
    expect(getDistVersion_1.default).not.toHaveBeenCalled();
}));
