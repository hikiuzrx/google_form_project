"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = concat;
const lift_1 = require("../util/lift");
const concatAll_1 = require("./concatAll");
const args_1 = require("../util/args");
const from_1 = require("../observable/from");
/**
 * @deprecated Replaced with {@link concatWith}. Will be removed in v8.
 */
function concat(...args) {
    const scheduler = (0, args_1.popScheduler)(args);
    return (0, lift_1.operate)((source, subscriber) => {
        (0, concatAll_1.concatAll)()((0, from_1.from)([source, ...args], scheduler)).subscribe(subscriber);
    });
}
