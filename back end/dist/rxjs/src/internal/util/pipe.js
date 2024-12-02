"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = pipe;
exports.pipeFromArray = pipeFromArray;
const identity_1 = require("./identity");
/**
 * pipe() can be called on one or more functions, each of which can take one argument ("UnaryFunction")
 * and uses it to return a value.
 * It returns a function that takes one argument, passes it to the first UnaryFunction, and then
 * passes the result to the next one, passes that result to the next one, and so on.
 */
function pipe(...fns) {
    return pipeFromArray(fns);
}
/** @internal */
function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity_1.identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce((prev, fn) => fn(prev), input);
    };
}
