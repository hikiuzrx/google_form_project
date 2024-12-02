"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isScheduler = isScheduler;
const isFunction_1 = require("./isFunction");
function isScheduler(value) {
    return value && (0, isFunction_1.isFunction)(value.schedule);
}
