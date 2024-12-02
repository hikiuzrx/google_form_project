"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObservable = isObservable;
/** prettier */
const Observable_1 = require("../Observable");
const isFunction_1 = require("./isFunction");
/**
 * Tests to see if the object is an RxJS {@link Observable}
 * @param obj the object to test
 */
function isObservable(obj) {
    // The !! is to ensure that this publicly exposed function returns
    // `false` if something like `null` or `0` is passed.
    return !!obj && (obj instanceof Observable_1.Observable || ((0, isFunction_1.isFunction)(obj.lift) && (0, isFunction_1.isFunction)(obj.subscribe)));
}
