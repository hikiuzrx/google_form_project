"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = void 0;
exports.timeout = timeout;
const async_1 = require("../scheduler/async");
const isDate_1 = require("../util/isDate");
const lift_1 = require("../util/lift");
const innerFrom_1 = require("../observable/innerFrom");
const createErrorClass_1 = require("../util/createErrorClass");
const OperatorSubscriber_1 = require("./OperatorSubscriber");
const executeSchedule_1 = require("../util/executeSchedule");
/**
 * An error thrown by the {@link timeout} operator.
 *
 * Provided so users can use as a type and do quality comparisons.
 * We recommend you do not subclass this or create instances of this class directly.
 * If you have need of a error representing a timeout, you should
 * create your own error class and use that.
 *
 * @see {@link timeout}
 *
 * @class TimeoutError
 */
exports.TimeoutError = (0, createErrorClass_1.createErrorClass)((_super) => function TimeoutErrorImpl(info = null) {
    _super(this);
    this.message = 'Timeout has occurred';
    this.name = 'TimeoutError';
    this.info = info;
});
/**
 *
 * Errors if Observable does not emit a value in given time span.
 *
 * <span class="informal">Timeouts on Observable that doesn't emit values fast enough.</span>
 *
 * ![](timeout.png)
 *
 * @see {@link timeoutWith}
 *
 * @return A function that returns an Observable that mirrors behaviour of the
 * source Observable, unless timeout happens when it throws an error.
 */
function timeout(config, schedulerArg) {
    // Intentionally terse code.
    // If the first argument is a valid `Date`, then we use it as the `first` config.
    // Otherwise, if the first argument is a `number`, then we use it as the `each` config.
    // Otherwise, it can be assumed the first argument is the configuration object itself, and
    // we destructure that into what we're going to use, setting important defaults as we do.
    // NOTE: The default for `scheduler` will be the `scheduler` argument if it exists, or
    // it will default to the `asyncScheduler`.
    const { first, each, with: _with = timeoutErrorFactory, scheduler = schedulerArg !== null && schedulerArg !== void 0 ? schedulerArg : async_1.asyncScheduler, meta = null, } = ((0, isDate_1.isValidDate)(config) ? { first: config } : typeof config === 'number' ? { each: config } : config);
    if (first == null && each == null) {
        // Ensure timeout was provided at runtime.
        throw new TypeError('No timeout provided.');
    }
    return (0, lift_1.operate)((source, subscriber) => {
        // This subscription encapsulates our subscription to the
        // source for this operator. We're capturing it separately,
        // because if there is a `with` observable to fail over to,
        // we want to unsubscribe from our original subscription, and
        // hand of the subscription to that one.
        let originalSourceSubscription;
        // The subscription for our timeout timer. This changes
        // every time we get a new value.
        let timerSubscription;
        // A bit of state we pass to our with and error factories to
        // tell what the last value we saw was.
        let lastValue = null;
        // A bit of state we pass to the with and error factories to
        // tell how many values we have seen so far.
        let seen = 0;
        const startTimer = (delay) => {
            timerSubscription = (0, executeSchedule_1.executeSchedule)(subscriber, scheduler, () => {
                try {
                    originalSourceSubscription.unsubscribe();
                    (0, innerFrom_1.innerFrom)(_with({
                        meta,
                        lastValue,
                        seen,
                    })).subscribe(subscriber);
                }
                catch (err) {
                    subscriber.error(err);
                }
            }, delay);
        };
        originalSourceSubscription = source.subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => {
            // clear the timer so we can emit and start another one.
            timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
            seen++;
            // Emit
            subscriber.next((lastValue = value));
            // null | undefined are both < 0. Thanks, JavaScript.
            each > 0 && startTimer(each);
        }, undefined, undefined, () => {
            if (!(timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.closed)) {
                timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
            }
            // Be sure not to hold the last value in memory after unsubscription
            // it could be quite large.
            lastValue = null;
        }));
        // Intentionally terse code.
        // If we've `seen` a value, that means the "first" clause was met already, if it existed.
        //   it also means that a timer was already started for "each" (in the next handler above).
        // If `first` was provided, and it's a number, then use it.
        // If `first` was provided and it's not a number, it's a Date, and we get the difference between it and "now".
        // If `first` was not provided at all, then our first timer will be the value from `each`.
        !seen && startTimer(first != null ? (typeof first === 'number' ? first : +first - scheduler.now()) : each);
    });
}
/**
 * The default function to use to emit an error when timeout occurs and a `with` function
 * is not specified.
 * @param info The information about the timeout to pass along to the error
 */
function timeoutErrorFactory(info) {
    throw new exports.TimeoutError(info);
}
