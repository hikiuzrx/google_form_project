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
const stream_1 = __importDefault(require("stream"));
const https_1 = __importDefault(require("https"));
const getDistVersion_1 = __importDefault(require("./getDistVersion"));
jest.mock('https', () => ({
    get: jest.fn(),
}));
test('Valid response returns version', () => __awaiter(void 0, void 0, void 0, function* () {
    const st = new stream_1.default();
    https_1.default.get.mockImplementation((url, cb) => {
        cb(st);
        st.emit('data', '{"latest":"1.0.0"}');
        st.emit('end');
    });
    const version = yield (0, getDistVersion_1.default)('test', 'latest');
    expect(version).toEqual('1.0.0');
}));
test('Invalid response throws error', () => __awaiter(void 0, void 0, void 0, function* () {
    const st = new stream_1.default();
    https_1.default.get.mockImplementation((url, cb) => {
        cb(st);
        st.emit('data', 'some invalid json');
        st.emit('end');
    });
    expect((0, getDistVersion_1.default)('test', 'latest')).rejects.toThrow('Could not parse version response');
}));
