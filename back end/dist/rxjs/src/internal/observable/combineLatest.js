"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineLatest = combineLatest;
exports.combineLatestInit = combineLatestInit;
const Observable_1 = require("../Observable");
const argsArgArrayOrObject_1 = require("../util/argsArgArrayOrObject");
const from_1 = require("./from");
const identity_1 = require("../util/identity");
const mapOneOrManyArgs_1 = require("../util/mapOneOrManyArgs");
const args_1 = require("../util/args");
const createObject_1 = require("../util/createObject");
const OperatorSubscriber_1 = require("../operators/OperatorSubscriber");
const executeSchedule_1 = require("../util/executeSchedule");
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * ![](combineLatest.png)
 *
 * `combineLatest` combines the values from all the Observables passed in the
 * observables array. This is done by subscribing to each Observable in order and,
 * whenever any Observable emits, collecting an array of the most recent
 * values from each Observable. So if you pass `n` Observables to this operator,
 * the returned Observable will always emit an array of `n` values, in an order
 * corresponding to the order of the passed Observables (the value from the first Observable
 * will be at index 0 of the array and so on).
 *
 * Static version of `combineLatest` accepts an array of Observables. Note that an array of
 * Observables is a good choice, if you don't know beforehand how many Observables
 * you will combine. Passing an empty array will result in an Observable that
 * completes immediately.
 *
 * To ensure the output array always has the same length, `combineLatest` will
 * actually wait for all input Observables to emit at least once,
 * before it starts emitting results. This means if some Observable emits
 * values before other Observables started emitting, all these values but the last
 * will be lost. On the other hand, if some Observable does not emit a value but
 * completes, resulting Observable will complete at the same moment without
 * emitting anything, since it will now be impossible to include a value from the
 * completed Observable in the resulting array. Also, if some input Observable does
 * not emit any value and never completes, `combineLatest` will also never emit
 * and never complete, since, again, it will wait for all streams to emit some
 * value.
 *
 * If at least one Observable was passed to `combineLatest` and all passed Observables
 * emitted something, the resulting Observable will complete when all combined
 * streams complete. So even if some Observable completes, the result of
 * `combineLatest` will still emit values when other Observables do. In case
 * of a completed Observable, its value from now on will always be the last
 * emitted value. On the other hand, if any Observable errors, `combineLatest`
 * will error immediately as well, and all other Observables will be unsubscribed.
 *
 * ## Examples
 *
 * Combine two timer Observables
 *
 * ```ts
 * import { timer, combineLatest } from 'rxjs';
 *
 * const firstTimer = timer(0, 1000); // emit 0, 1, 2... after every second, starting from now
 * const secondTimer = timer(500, 1000); // emit 0, 1, 2... after every second, starting 0,5s from now
 * const combinedTimers = combineLatest([firstTimer, secondTimer]);
 * combinedTimers.subscribe(value => console.log(value));
 * // Logs
 * // [0, 0] after 0.5s
 * // [1, 0] after 1s
 * // [1, 1] after 1.5s
 * // [2, 1] after 2s
 * ```
 *
 * Combine a dictionary of Observables
 *
 * ```ts
 * import { of, delay, startWith, combineLatest } from 'rxjs';
 *
 * const observables = {
 *   a: of(1).pipe(delay(1000), startWith(0)),
 *   b: of(5).pipe(delay(5000), startWith(0)),
 *   c: of(10).pipe(delay(10000), startWith(0))
 * };
 * const combined = combineLatest(observables);
 * combined.subscribe(value => console.log(value));
 * // Logs
 * // { a: 0, b: 0, c: 0 } immediately
 * // { a: 1, b: 0, c: 0 } after 1s
 * // { a: 1, b: 5, c: 0 } after 5s
 * // { a: 1, b: 5, c: 10 } after 10s
 * ```
 *
 * Combine an array of Observables
 *
 * ```ts
 * import { of, delay, startWith, combineLatest } from 'rxjs';
 *
 * const observables = [1, 5, 10].map(
 *   n => of(n).pipe(
 *     delay(n * 1000), // emit 0 and then emit n after n seconds
 *     startWith(0)
 *   )
 * );
 * const combined = combineLatest(observables);
 * combined.subscribe(value => console.log(value));
 * // Logs
 * // [0, 0, 0] immediately
 * // [1, 0, 0] after 1s
 * // [1, 5, 0] after 5s
 * // [1, 5, 10] after 10s
 * ```
 *
 * Use map operator to dynamically calculate the Body-Mass Index
 *
 * ```ts
 * import { of, combineLatest, map } from 'rxjs';
 *
 * const weight = of(70, 72, 76, 79, 75);
 * const height = of(1.76, 1.77, 1.78);
 * const bmi = combineLatest([weight, height]).pipe(
 *   map(([w, h]) => w / (h * h)),
 * );
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * // With output to console:
 * // BMI is 24.212293388429753
 * // BMI is 23.93948099205209
 * // BMI is 23.671253629592222
 * ```
 *
 * @see {@link combineLatestAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {ObservableInput} [observables] An array of input Observables to combine with each other.
 * An array of Observables must be given as the first argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @param {SchedulerLike} [scheduler=null] The {@link SchedulerLike} to use for subscribing to
 * each input Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 */
function combineLatest(...args) {
    const scheduler = (0, args_1.popScheduler)(args);
    const resultSelector = (0, args_1.popResultSelector)(args);
    const { args: observables, keys } = (0, argsArgArrayOrObject_1.argsArgArrayOrObject)(args);
    if (observables.length === 0) {
        // If no observables are passed, or someone has passed an empty array
        // of observables, or even an empty object POJO, we need to just
        // complete (EMPTY), but we have to honor the scheduler provided if any.
        return (0, from_1.from)([], scheduler);
    }
    const result = new Observable_1.Observable(combineLatestInit(observables, scheduler, keys
        ? // A handler for scrubbing the array of args into a dictionary.
            (values) => (0, createObject_1.createObject)(keys, values)
        : // A passthrough to just return the array
            identity_1.identity));
    return resultSelector ? result.pipe((0, mapOneOrManyArgs_1.mapOneOrManyArgs)(resultSelector)) : result;
}
function combineLatestInit(observables, scheduler, valueTransform = identity_1.identity) {
    return (subscriber) => {
        // The outer subscription. We're capturing this in a function
        // because we may have to schedule it.
        maybeSchedule(scheduler, () => {
            const { length } = observables;
            // A store for the values each observable has emitted so far. We match observable to value on index.
            const values = new Array(length);
            // The number of currently active subscriptions, as they complete, we decrement this number to see if
            // we are all done combining values, so we can complete the result.
            let active = length;
            // The number of inner sources that still haven't emitted the first value
            // We need to track this because all sources need to emit one value in order
            // to start emitting values.
            let remainingFirstValues = length;
            // The loop to kick off subscription. We're keying everything on index `i` to relate the observables passed
            // in to the slot in the output array or the key in the array of keys in the output dictionary.
            for (let i = 0; i < length; i++) {
                maybeSchedule(scheduler, () => {
                    const source = (0, from_1.from)(observables[i], scheduler);
                    let hasFirstValue = false;
                    source.subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => {
                        // When we get a value, record it in our set of values.
                        values[i] = value;
                        if (!hasFirstValue) {
                            // If this is our first value, record that.
                            hasFirstValue = true;
                            remainingFirstValues--;
                        }
                        if (!remainingFirstValues) {
                            // We're not waiting for any more
                            // first values, so we can emit!
                            subscriber.next(valueTransform(values.slice()));
                        }
                    }, () => {
                        if (!--active) {
                            // We only complete the result if we have no more active
                            // inner observables.
                            subscriber.complete();
                        }
                    }));
                }, subscriber);
            }
        }, subscriber);
    };
}
/**
 * A small utility to handle the couple of locations where we want to schedule if a scheduler was provided,
 * but we don't if there was no scheduler.
 */
function maybeSchedule(scheduler, execute, subscription) {
    if (scheduler) {
        (0, executeSchedule_1.executeSchedule)(subscription, scheduler, execute);
    }
    else {
        execute();
    }
}
