"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = isFunction;
/**
 * Returns true if the object is a function.
 * @param value The value to check
 */
function isFunction(value) {
    return typeof value === 'function';
}
