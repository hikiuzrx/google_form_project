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
const _1 = __importDefault(require("."));
const hasNewVersion_1 = __importDefault(require("./hasNewVersion"));
const consoleSpy = jest.spyOn(console, 'error');
jest.mock('./hasNewVersion', () => jest.fn().mockResolvedValue('2.0.0'));
beforeEach(jest.clearAllMocks);
test('it logs message if update is available', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, _1.default)({
        pkg: { name: 'test', version: '1.0.0' },
        alwaysRun: true,
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
}));
test('it does not log message if update is not available', () => __awaiter(void 0, void 0, void 0, function* () {
    hasNewVersion_1.default.mockResolvedValue(false);
    yield (0, _1.default)({
        pkg: { name: 'test', version: '2.0.0' },
        alwaysRun: true,
    });
    expect(consoleSpy).toHaveBeenCalledTimes(0);
}));
