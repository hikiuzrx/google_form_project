"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.windowToggle = windowToggle;
const Subject_1 = require("../Subject");
const Subscription_1 = require("../Subscription");
const lift_1 = require("../util/lift");
const innerFrom_1 = require("../observable/innerFrom");
const OperatorSubscriber_1 = require("./OperatorSubscriber");
const noop_1 = require("../util/noop");
const arrRemove_1 = require("../util/arrRemove");
/**
 * Branch out the source Observable values as a nested Observable starting from
 * an emission from `openings` and ending when the output of `closingSelector`
 * emits.
 *
 * <span class="informal">It's like {@link bufferToggle}, but emits a nested
 * Observable instead of an array.</span>
 *
 * ![](windowToggle.png)
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits windows that contain those items
 * emitted by the source Observable between the time when the `openings`
 * Observable emits an item and when the Observable returned by
 * `closingSelector` emits an item.
 *
 * ## Example
 *
 * Every other second, emit the click events from the next 500ms
 *
 * ```ts
 * import { fromEvent, interval, windowToggle, EMPTY, mergeAll } from 'rxjs';
 *
 * const clicks = fromEvent(document, 'click');
 * const openings = interval(1000);
 * const result = clicks.pipe(
 *   windowToggle(openings, i => i % 2 ? interval(500) : EMPTY),
 *   mergeAll()
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowWhen}
 * @see {@link bufferToggle}
 *
 * @param {Observable<O>} openings An observable of notifications to start new
 * windows.
 * @param {function(value: O): Observable} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns an Observable,
 * which, when it emits a next notification, signals that the
 * associated window should complete.
 * @return A function that returns an Observable of windows, which in turn are
 * Observables.
 */
function windowToggle(openings, closingSelector) {
    return (0, lift_1.operate)((source, subscriber) => {
        const windows = [];
        const handleError = (err) => {
            while (0 < windows.length) {
                windows.shift().error(err);
            }
            subscriber.error(err);
        };
        (0, innerFrom_1.innerFrom)(openings).subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (openValue) => {
            const window = new Subject_1.Subject();
            windows.push(window);
            const closingSubscription = new Subscription_1.Subscription();
            const closeWindow = () => {
                (0, arrRemove_1.arrRemove)(windows, window);
                window.complete();
                closingSubscription.unsubscribe();
            };
            let closingNotifier;
            try {
                closingNotifier = (0, innerFrom_1.innerFrom)(closingSelector(openValue));
            }
            catch (err) {
                handleError(err);
                return;
            }
            subscriber.next(window.asObservable());
            closingSubscription.add(closingNotifier.subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, closeWindow, noop_1.noop, handleError)));
        }, noop_1.noop));
        // Subscribe to the source to get things started.
        source.subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => {
            // Copy the windows array before we emit to
            // make sure we don't have issues with reentrant code.
            const windowsCopy = windows.slice();
            for (const window of windowsCopy) {
                window.next(value);
            }
        }, () => {
            // Complete all of our windows before we complete.
            while (0 < windows.length) {
                windows.shift().complete();
            }
            subscriber.complete();
        }, handleError, () => {
            // Add this finalization so that all window subjects are
            // disposed of. This way, if a user tries to subscribe
            // to a window *after* the outer subscription has been unsubscribed,
            // they will get an error, instead of waiting forever to
            // see if a value arrives.
            while (0 < windows.length) {
                windows.shift().unsubscribe();
            }
        }));
    });
}
