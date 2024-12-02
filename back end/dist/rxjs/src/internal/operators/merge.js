"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = merge;
const lift_1 = require("../util/lift");
const argsOrArgArray_1 = require("../util/argsOrArgArray");
const mergeAll_1 = require("./mergeAll");
const args_1 = require("../util/args");
const from_1 = require("../observable/from");
function merge(...args) {
    const scheduler = (0, args_1.popScheduler)(args);
    const concurrent = (0, args_1.popNumber)(args, Infinity);
    args = (0, argsOrArgArray_1.argsOrArgArray)(args);
    return (0, lift_1.operate)((source, subscriber) => {
        (0, mergeAll_1.mergeAll)(concurrent)((0, from_1.from)([source, ...args], scheduler)).subscribe(subscriber);
    });
}
