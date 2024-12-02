"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleAsyncIterable = scheduleAsyncIterable;
const Observable_1 = require("../Observable");
const executeSchedule_1 = require("../util/executeSchedule");
function scheduleAsyncIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    return new Observable_1.Observable((subscriber) => {
        (0, executeSchedule_1.executeSchedule)(subscriber, scheduler, () => {
            const iterator = input[Symbol.asyncIterator]();
            (0, executeSchedule_1.executeSchedule)(subscriber, scheduler, () => {
                iterator.next().then((result) => {
                    if (result.done) {
                        // This will remove the subscriptions from
                        // the parent subscription.
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(result.value);
                    }
                });
            }, 0, true);
        });
    });
}
