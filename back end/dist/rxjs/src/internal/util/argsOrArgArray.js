"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argsOrArgArray = argsOrArgArray;
const { isArray } = Array;
/**
 * Used in operators and functions that accept either a list of arguments, or an array of arguments
 * as a single argument.
 */
function argsOrArgArray(args) {
    return args.length === 1 && isArray(args[0]) ? args[0] : args;
}
