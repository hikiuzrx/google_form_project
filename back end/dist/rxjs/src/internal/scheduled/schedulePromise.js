"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulePromise = schedulePromise;
const innerFrom_1 = require("../observable/innerFrom");
const observeOn_1 = require("../operators/observeOn");
const subscribeOn_1 = require("../operators/subscribeOn");
function schedulePromise(input, scheduler) {
    return (0, innerFrom_1.innerFrom)(input).pipe((0, subscribeOn_1.subscribeOn)(scheduler), (0, observeOn_1.observeOn)(scheduler));
}
