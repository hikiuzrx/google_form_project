"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleIterable = scheduleIterable;
const Observable_1 = require("../Observable");
const iterator_1 = require("../symbol/iterator");
const isFunction_1 = require("../util/isFunction");
const executeSchedule_1 = require("../util/executeSchedule");
/**
 * Used in {@link scheduled} to create an observable from an Iterable.
 * @param input The iterable to create an observable from
 * @param scheduler The scheduler to use
 */
function scheduleIterable(input, scheduler) {
    return new Observable_1.Observable((subscriber) => {
        let iterator;
        // Schedule the initial creation of the iterator from
        // the iterable. This is so the code in the iterable is
        // not called until the scheduled job fires.
        (0, executeSchedule_1.executeSchedule)(subscriber, scheduler, () => {
            // Create the iterator.
            iterator = input[iterator_1.iterator]();
            (0, executeSchedule_1.executeSchedule)(subscriber, scheduler, () => {
                let value;
                let done;
                try {
                    // Pull the value out of the iterator
                    ({ value, done } = iterator.next());
                }
                catch (err) {
                    // We got an error while pulling from the iterator
                    subscriber.error(err);
                    return;
                }
                if (done) {
                    // If it is "done" we just complete. This mimics the
                    // behavior of JavaScript's `for..of` consumption of
                    // iterables, which will not emit the value from an iterator
                    // result of `{ done: true: value: 'here' }`.
                    subscriber.complete();
                }
                else {
                    // The iterable is not done, emit the value.
                    subscriber.next(value);
                }
            }, 0, true);
        });
        // During finalization, if we see this iterator has a `return` method,
        // then we know it is a Generator, and not just an Iterator. So we call
        // the `return()` function. This will ensure that any `finally { }` blocks
        // inside of the generator we can hit will be hit properly.
        return () => (0, isFunction_1.isFunction)(iterator === null || iterator === void 0 ? void 0 : iterator.return) && iterator.return();
    });
}
