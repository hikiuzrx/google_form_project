"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateTimestampProvider = void 0;
exports.dateTimestampProvider = {
    now() {
        // Use the variable rather than `this` so that the function can be called
        // without being bound to the provider.
        return (exports.dateTimestampProvider.delegate || Date).now();
    },
    delegate: undefined,
};
