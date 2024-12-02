"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("./cache");
(0, cache_1.createConfigDir)();
jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
const fakeTime = new Date('2022-01-01').getTime();
test('can save update then get the update details', () => {
    (0, cache_1.saveLastUpdate)('test');
    expect((0, cache_1.getLastUpdate)('test')).toBe(fakeTime);
});
test('prefixed module can save update then get the update details', () => {
    (0, cache_1.saveLastUpdate)('@alexbrazier/test');
    expect((0, cache_1.getLastUpdate)('@alexbrazier/test')).toBe(fakeTime);
});
