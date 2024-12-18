"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindCallbackInternals = bindCallbackInternals;
const isScheduler_1 = require("../util/isScheduler");
const Observable_1 = require("../Observable");
const subscribeOn_1 = require("../operators/subscribeOn");
const mapOneOrManyArgs_1 = require("../util/mapOneOrManyArgs");
const observeOn_1 = require("../operators/observeOn");
const AsyncSubject_1 = require("../AsyncSubject");
function bindCallbackInternals(isNodeStyle, callbackFunc, resultSelector, scheduler) {
    if (resultSelector) {
        if ((0, isScheduler_1.isScheduler)(resultSelector)) {
            scheduler = resultSelector;
        }
        else {
            // The user provided a result selector.
            return function (...args) {
                return bindCallbackInternals(isNodeStyle, callbackFunc, scheduler)
                    .apply(this, args)
                    .pipe((0, mapOneOrManyArgs_1.mapOneOrManyArgs)(resultSelector));
            };
        }
    }
    // If a scheduler was passed, use our `subscribeOn` and `observeOn` operators
    // to compose that behavior for the user.
    if (scheduler) {
        return function (...args) {
            return bindCallbackInternals(isNodeStyle, callbackFunc)
                .apply(this, args)
                .pipe((0, subscribeOn_1.subscribeOn)(scheduler), (0, observeOn_1.observeOn)(scheduler));
        };
    }
    return function (...args) {
        // We're using AsyncSubject, because it emits when it completes,
        // and it will play the value to all late-arriving subscribers.
        const subject = new AsyncSubject_1.AsyncSubject();
        // If this is true, then we haven't called our function yet.
        let uninitialized = true;
        return new Observable_1.Observable((subscriber) => {
            // Add our subscriber to the subject.
            const subs = subject.subscribe(subscriber);
            if (uninitialized) {
                uninitialized = false;
                // We're going to execute the bound function
                // This bit is to signal that we are hitting the callback asynchronously.
                // Because we don't have any anti-"Zalgo" guarantees with whatever
                // function we are handed, we use this bit to figure out whether or not
                // we are getting hit in a callback synchronously during our call.
                let isAsync = false;
                // This is used to signal that the callback completed synchronously.
                let isComplete = false;
                // Call our function that has a callback. If at any time during this
                // call, an error is thrown, it will be caught by the Observable
                // subscription process and sent to the consumer.
                callbackFunc.apply(
                // Pass the appropriate `this` context.
                this, [
                    // Pass the arguments.
                    ...args,
                    // And our callback handler.
                    (...results) => {
                        if (isNodeStyle) {
                            // If this is a node callback, shift the first value off of the
                            // results and check it, as it is the error argument. By shifting,
                            // we leave only the argument(s) we want to pass to the consumer.
                            const err = results.shift();
                            if (err != null) {
                                subject.error(err);
                                // If we've errored, we can stop processing this function
                                // as there's nothing else to do. Just return to escape.
                                return;
                            }
                        }
                        // If we have one argument, notify the consumer
                        // of it as a single value, otherwise, if there's more than one, pass
                        // them as an array. Note that if there are no arguments, `undefined`
                        // will be emitted.
                        subject.next(1 < results.length ? results : results[0]);
                        // Flip this flag, so we know we can complete it in the synchronous
                        // case below.
                        isComplete = true;
                        // If we're not asynchronous, we need to defer the `complete` call
                        // until after the call to the function is over. This is because an
                        // error could be thrown in the function after it calls our callback,
                        // and if that is the case, if we complete here, we are unable to notify
                        // the consumer than an error occurred.
                        if (isAsync) {
                            subject.complete();
                        }
                    },
                ]);
                // If we flipped `isComplete` during the call, we resolved synchronously,
                // notify complete, because we skipped it in the callback to wait
                // to make sure there were no errors during the call.
                if (isComplete) {
                    subject.complete();
                }
                // We're no longer synchronous. If the callback is called at this point
                // we can notify complete on the spot.
                isAsync = true;
            }
            // Return the subscription from adding our subscriber to the subject.
            return subs;
        });
    };
}
