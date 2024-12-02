"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIterable = isIterable;
const iterator_1 = require("../symbol/iterator");
const isFunction_1 = require("./isFunction");
/** Identifies an input as being an Iterable */
function isIterable(input) {
    return (0, isFunction_1.isFunction)(input === null || input === void 0 ? void 0 : input[iterator_1.iterator]);
}
