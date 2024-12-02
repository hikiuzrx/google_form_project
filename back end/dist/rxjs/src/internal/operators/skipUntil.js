"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipUntil = skipUntil;
const lift_1 = require("../util/lift");
const OperatorSubscriber_1 = require("./OperatorSubscriber");
const innerFrom_1 = require("../observable/innerFrom");
const noop_1 = require("../util/noop");
/**
 * Returns an Observable that skips items emitted by the source Observable until a second Observable emits an item.
 *
 * The `skipUntil` operator causes the observable stream to skip the emission of values until the passed in observable
 * emits the first value. This can be particularly useful in combination with user interactions, responses of HTTP
 * requests or waiting for specific times to pass by.
 *
 * ![](skipUntil.png)
 *
 * Internally, the `skipUntil` operator subscribes to the passed in `notifier` `ObservableInput` (which gets converted
 * to an Observable) in order to recognize the emission of its first value. When `notifier` emits next, the operator
 * unsubscribes from it and starts emitting the values of the *source* observable until it completes or errors. It
 * will never let the *source* observable emit any values if the `notifier` completes or throws an error without
 * emitting a value before.
 *
 * ## Example
 *
 * In the following example, all emitted values of the interval observable are skipped until the user clicks anywhere
 * within the page
 *
 * ```ts
 * import { interval, fromEvent, skipUntil } from 'rxjs';
 *
 * const intervalObservable = interval(1000);
 * const click = fromEvent(document, 'click');
 *
 * const emitAfterClick = intervalObservable.pipe(
 *   skipUntil(click)
 * );
 * // clicked at 4.6s. output: 5...6...7...8........ or
 * // clicked at 7.3s. output: 8...9...10..11.......
 * emitAfterClick.subscribe(value => console.log(value));
 * ```
 *
 * @see {@link last}
 * @see {@link skip}
 * @see {@link skipWhile}
 * @see {@link skipLast}
 *
 * @param notifier An `ObservableInput` that has to emit an item before the source Observable elements begin to
 * be mirrored by the resulting Observable.
 * @return A function that returns an Observable that skips items from the
 * source Observable until the `notifier` Observable emits an item, then emits the
 * remaining items.
 */
function skipUntil(notifier) {
    return (0, lift_1.operate)((source, subscriber) => {
        let taking = false;
        const skipSubscriber = (0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, () => {
            skipSubscriber === null || skipSubscriber === void 0 ? void 0 : skipSubscriber.unsubscribe();
            taking = true;
        }, noop_1.noop);
        (0, innerFrom_1.innerFrom)(notifier).subscribe(skipSubscriber);
        source.subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => taking && subscriber.next(value)));
    });
}
