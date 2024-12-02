"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.popResultSelector = popResultSelector;
exports.popScheduler = popScheduler;
exports.popNumber = popNumber;
const isFunction_1 = require("./isFunction");
const isScheduler_1 = require("./isScheduler");
function last(arr) {
    return arr[arr.length - 1];
}
function popResultSelector(args) {
    return (0, isFunction_1.isFunction)(last(args)) ? args.pop() : undefined;
}
function popScheduler(args) {
    return (0, isScheduler_1.isScheduler)(last(args)) ? args.pop() : undefined;
}
function popNumber(args, defaultValue) {
    return typeof last(args) === 'number' ? args.pop() : defaultValue;
}
