"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromise = isPromise;
const isFunction_1 = require("./isFunction");
/**
 * Tests to see if the object is "thennable".
 * @param value the object to test
 */
function isPromise(value) {
    return (0, isFunction_1.isFunction)(value === null || value === void 0 ? void 0 : value.then);
}
