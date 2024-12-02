"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasLift = hasLift;
exports.operate = operate;
const isFunction_1 = require("./isFunction");
/**
 * Used to determine if an object is an Observable with a lift function.
 */
function hasLift(source) {
    return (0, isFunction_1.isFunction)(source === null || source === void 0 ? void 0 : source.lift);
}
/**
 * Creates an `OperatorFunction`. Used to define operators throughout the library in a concise way.
 * @param init The logic to connect the liftedSource to the subscriber at the moment of subscription.
 */
function operate(init) {
    return (source) => {
        if (hasLift(source)) {
            return source.lift(function (liftedSource) {
                try {
                    return init(liftedSource, this);
                }
                catch (err) {
                    this.error(err);
                }
            });
        }
        throw new TypeError('Unable to lift unknown Observable type');
    };
}
