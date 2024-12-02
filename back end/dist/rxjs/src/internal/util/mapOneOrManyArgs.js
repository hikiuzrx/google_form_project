"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapOneOrManyArgs = mapOneOrManyArgs;
const map_1 = require("../operators/map");
const { isArray } = Array;
function callOrApply(fn, args) {
    return isArray(args) ? fn(...args) : fn(args);
}
/**
 * Used in several -- mostly deprecated -- situations where we need to
 * apply a list of arguments or a single argument to a result selector.
 */
function mapOneOrManyArgs(fn) {
    return (0, map_1.map)(args => callOrApply(fn, args));
}
