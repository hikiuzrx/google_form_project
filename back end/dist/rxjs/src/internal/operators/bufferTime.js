"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferTime = bufferTime;
const Subscription_1 = require("../Subscription");
const lift_1 = require("../util/lift");
const OperatorSubscriber_1 = require("./OperatorSubscriber");
const arrRemove_1 = require("../util/arrRemove");
const async_1 = require("../scheduler/async");
const args_1 = require("../util/args");
const executeSchedule_1 = require("../util/executeSchedule");
/* tslint:enable:max-line-length */
/**
 * Buffers the source Observable values for a specific time period.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * those arrays periodically in time.</span>
 *
 * ![](bufferTime.png)
 *
 * Buffers values from the source for a specific time duration `bufferTimeSpan`.
 * Unless the optional argument `bufferCreationInterval` is given, it emits and
 * resets the buffer every `bufferTimeSpan` milliseconds. If
 * `bufferCreationInterval` is given, this operator opens the buffer every
 * `bufferCreationInterval` milliseconds and closes (emits and resets) the
 * buffer every `bufferTimeSpan` milliseconds. When the optional argument
 * `maxBufferSize` is specified, the buffer will be closed either after
 * `bufferTimeSpan` milliseconds or when it contains `maxBufferSize` elements.
 *
 * ## Examples
 *
 * Every second, emit an array of the recent click events
 *
 * ```ts
 * import { fromEvent, bufferTime } from 'rxjs';
 *
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferTime(1000));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * Every 5 seconds, emit the click events from the next 2 seconds
 *
 * ```ts
 * import { fromEvent, bufferTime } from 'rxjs';
 *
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferTime(2000, 5000));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link windowTime}
 *
 * @param {number} bufferTimeSpan The amount of time to fill each buffer array.
 * @param {number} [bufferCreationInterval] The interval at which to start new
 * buffers.
 * @param {number} [maxBufferSize] The maximum buffer size.
 * @param {SchedulerLike} [scheduler=async] The scheduler on which to schedule the
 * intervals that determine buffer boundaries.
 * @return A function that returns an Observable of arrays of buffered values.
 */
function bufferTime(bufferTimeSpan, ...otherArgs) {
    var _a, _b;
    const scheduler = (_a = (0, args_1.popScheduler)(otherArgs)) !== null && _a !== void 0 ? _a : async_1.asyncScheduler;
    const bufferCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
    const maxBufferSize = otherArgs[1] || Infinity;
    return (0, lift_1.operate)((source, subscriber) => {
        // The active buffers, their related subscriptions, and removal functions.
        let bufferRecords = [];
        // If true, it means that every time we emit a buffer, we want to start a new buffer
        // this is only really used for when *just* the buffer time span is passed.
        let restartOnEmit = false;
        /**
         * Does the work of emitting the buffer from the record, ensuring that the
         * record is removed before the emission so reentrant code (from some custom scheduling, perhaps)
         * does not alter the buffer. Also checks to see if a new buffer needs to be started
         * after the emit.
         */
        const emit = (record) => {
            const { buffer, subs } = record;
            subs.unsubscribe();
            (0, arrRemove_1.arrRemove)(bufferRecords, record);
            subscriber.next(buffer);
            restartOnEmit && startBuffer();
        };
        /**
         * Called every time we start a new buffer. This does
         * the work of scheduling a job at the requested bufferTimeSpan
         * that will emit the buffer (if it's not unsubscribed before then).
         */
        const startBuffer = () => {
            if (bufferRecords) {
                const subs = new Subscription_1.Subscription();
                subscriber.add(subs);
                const buffer = [];
                const record = {
                    buffer,
                    subs,
                };
                bufferRecords.push(record);
                (0, executeSchedule_1.executeSchedule)(subs, scheduler, () => emit(record), bufferTimeSpan);
            }
        };
        if (bufferCreationInterval !== null && bufferCreationInterval >= 0) {
            // The user passed both a bufferTimeSpan (required), and a creation interval
            // That means we need to start new buffers on the interval, and those buffers need
            // to wait the required time span before emitting.
            (0, executeSchedule_1.executeSchedule)(subscriber, scheduler, startBuffer, bufferCreationInterval, true);
        }
        else {
            restartOnEmit = true;
        }
        startBuffer();
        const bufferTimeSubscriber = (0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => {
            // Copy the records, so if we need to remove one we
            // don't mutate the array. It's hard, but not impossible to
            // set up a buffer time that could mutate the array and
            // cause issues here.
            const recordsCopy = bufferRecords.slice();
            for (const record of recordsCopy) {
                // Loop over all buffers and
                const { buffer } = record;
                buffer.push(value);
                // If the buffer is over the max size, we need to emit it.
                maxBufferSize <= buffer.length && emit(record);
            }
        }, () => {
            // The source completed, emit all of the active
            // buffers we have before we complete.
            while (bufferRecords === null || bufferRecords === void 0 ? void 0 : bufferRecords.length) {
                subscriber.next(bufferRecords.shift().buffer);
            }
            bufferTimeSubscriber === null || bufferTimeSubscriber === void 0 ? void 0 : bufferTimeSubscriber.unsubscribe();
            subscriber.complete();
            subscriber.unsubscribe();
        }, 
        // Pass all errors through to consumer.
        undefined, 
        // Clean up
        () => (bufferRecords = null));
        source.subscribe(bufferTimeSubscriber);
    });
}
