"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInteropObservable = isInteropObservable;
const observable_1 = require("../symbol/observable");
const isFunction_1 = require("./isFunction");
/** Identifies an input as being Observable (but not necessary an Rx Observable) */
function isInteropObservable(input) {
    return (0, isFunction_1.isFunction)(input[observable_1.observable]);
}
