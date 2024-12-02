"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = throwError;
const Observable_1 = require("../Observable");
const isFunction_1 = require("../util/isFunction");
function throwError(errorOrErrorFactory, scheduler) {
    const errorFactory = (0, isFunction_1.isFunction)(errorOrErrorFactory) ? errorOrErrorFactory : () => errorOrErrorFactory;
    const init = (subscriber) => subscriber.error(errorFactory());
    return new Observable_1.Observable(scheduler ? (subscriber) => scheduler.schedule(init, 0, subscriber) : init);
}
