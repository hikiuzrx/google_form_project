"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.window = window;
const Subject_1 = require("../Subject");
const lift_1 = require("../util/lift");
const OperatorSubscriber_1 = require("./OperatorSubscriber");
const noop_1 = require("../util/noop");
const innerFrom_1 = require("../observable/innerFrom");
/**
 * Branch out the source Observable values as a nested Observable whenever
 * `windowBoundaries` emits.
 *
 * <span class="informal">It's like {@link buffer}, but emits a nested Observable
 * instead of an array.</span>
 *
 * ![](window.png)
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping
 * windows. It emits the current window and opens a new one whenever the
 * `windowBoundaries` emits an item. `windowBoundaries` can be any type that
 * `ObservableInput` accepts. It internally gets converted to an Observable.
 * Because each window is an Observable, the output is a higher-order Observable.
 *
 * ## Example
 *
 * In every window of 1 second each, emit at most 2 click events
 *
 * ```ts
 * import { fromEvent, interval, window, map, take, mergeAll } from 'rxjs';
 *
 * const clicks = fromEvent(document, 'click');
 * const sec = interval(1000);
 * const result = clicks.pipe(
 *   window(sec),
 *   map(win => win.pipe(take(2))), // take at most 2 emissions from each window
 *   mergeAll()                     // flatten the Observable-of-Observables
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link buffer}
 *
 * @param windowBoundaries An `ObservableInput` that completes the
 * previous window and starts a new window.
 * @return A function that returns an Observable of windows, which are
 * Observables emitting values of the source Observable.
 */
function window(windowBoundaries) {
    return (0, lift_1.operate)((source, subscriber) => {
        let windowSubject = new Subject_1.Subject();
        subscriber.next(windowSubject.asObservable());
        const errorHandler = (err) => {
            windowSubject.error(err);
            subscriber.error(err);
        };
        // Subscribe to our source
        source.subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.next(value), () => {
            windowSubject.complete();
            subscriber.complete();
        }, errorHandler));
        // Subscribe to the window boundaries.
        (0, innerFrom_1.innerFrom)(windowBoundaries).subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, () => {
            windowSubject.complete();
            subscriber.next((windowSubject = new Subject_1.Subject()));
        }, noop_1.noop, errorHandler));
        return () => {
            // Unsubscribing the subject ensures that anyone who has captured
            // a reference to this window that tries to use it after it can
            // no longer get values from the source will get an ObjectUnsubscribedError.
            windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.unsubscribe();
            windowSubject = null;
        };
    });
}
