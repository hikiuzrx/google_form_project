"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceTimestampProvider = void 0;
exports.performanceTimestampProvider = {
    now() {
        // Use the variable rather than `this` so that the function can be called
        // without being bound to the provider.
        return (exports.performanceTimestampProvider.delegate || performance).now();
    },
    delegate: undefined,
};
