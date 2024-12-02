"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animationFrameProvider = void 0;
const Subscription_1 = require("../Subscription");
exports.animationFrameProvider = {
    // When accessing the delegate, use the variable rather than `this` so that
    // the functions can be called without being bound to the provider.
    schedule(callback) {
        let request = requestAnimationFrame;
        let cancel = cancelAnimationFrame;
        const { delegate } = exports.animationFrameProvider;
        if (delegate) {
            request = delegate.requestAnimationFrame;
            cancel = delegate.cancelAnimationFrame;
        }
        const handle = request((timestamp) => {
            // Clear the cancel function. The request has been fulfilled, so
            // attempting to cancel the request upon unsubscription would be
            // pointless.
            cancel = undefined;
            callback(timestamp);
        });
        return new Subscription_1.Subscription(() => cancel === null || cancel === void 0 ? void 0 : cancel(handle));
    },
    requestAnimationFrame(...args) {
        const { delegate } = exports.animationFrameProvider;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame)(...args);
    },
    cancelAnimationFrame(...args) {
        const { delegate } = exports.animationFrameProvider;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame)(...args);
    },
    delegate: undefined,
};
