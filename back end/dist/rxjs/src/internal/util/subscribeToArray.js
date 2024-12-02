"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToArray = void 0;
/**
 * Subscribes to an ArrayLike with a subscriber
 * @param array The array or array-like to subscribe to
 */
const subscribeToArray = (array) => (subscriber) => {
    for (let i = 0, len = array.length; i < len && !subscriber.closed; i++) {
        subscriber.next(array[i]);
    }
    subscriber.complete();
};
exports.subscribeToArray = subscribeToArray;
