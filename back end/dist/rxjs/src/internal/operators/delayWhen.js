"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayWhen = delayWhen;
const concat_1 = require("../observable/concat");
const take_1 = require("./take");
const ignoreElements_1 = require("./ignoreElements");
const mapTo_1 = require("./mapTo");
const mergeMap_1 = require("./mergeMap");
const innerFrom_1 = require("../observable/innerFrom");
/**
 * Delays the emission of items from the source Observable by a given time span
 * determined by the emissions of another Observable.
 *
 * <span class="informal">It's like {@link delay}, but the time span of the
 * delay duration is determined by a second Observable.</span>
 *
 * ![](delayWhen.png)
 *
 * `delayWhen` operator shifts each emitted value from the source Observable by
 * a time span determined by another Observable. When the source emits a value,
 * the `delayDurationSelector` function is called with the value emitted from
 * the source Observable as the first argument to the `delayDurationSelector`.
 * The `delayDurationSelector` function should return an {@link ObservableInput},
 * that is internally converted to an Observable that is called the "duration"
 * Observable.
 *
 * The source value is emitted on the output Observable only when the "duration"
 * Observable emits ({@link guide/glossary-and-semantics#next next}s) any value.
 * Upon that, the "duration" Observable gets unsubscribed.
 *
 * Before RxJS V7, the {@link guide/glossary-and-semantics#complete completion}
 * of the "duration" Observable would have been triggering the emission of the
 * source value to the output Observable, but with RxJS V7, this is not the case
 * anymore.
 *
 * Only next notifications (from the "duration" Observable) trigger values from
 * the source Observable to be passed to the output Observable. If the "duration"
 * Observable only emits the complete notification (without next), the value
 * emitted by the source Observable will never get to the output Observable - it
 * will be swallowed. If the "duration" Observable errors, the error will be
 * propagated to the output Observable.
 *
 * Optionally, `delayWhen` takes a second argument, `subscriptionDelay`, which
 * is an Observable. When `subscriptionDelay` emits its first value or
 * completes, the source Observable is subscribed to and starts behaving like
 * described in the previous paragraph. If `subscriptionDelay` is not provided,
 * `delayWhen` will subscribe to the source Observable as soon as the output
 * Observable is subscribed.
 *
 * ## Example
 *
 * Delay each click by a random amount of time, between 0 and 5 seconds
 *
 * ```ts
 * import { fromEvent, delayWhen, interval } from 'rxjs';
 *
 * const clicks = fromEvent(document, 'click');
 * const delayedClicks = clicks.pipe(
 *   delayWhen(() => interval(Math.random() * 5000))
 * );
 * delayedClicks.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link delay}
 * @see {@link throttle}
 * @see {@link throttleTime}
 * @see {@link debounce}
 * @see {@link debounceTime}
 * @see {@link sample}
 * @see {@link sampleTime}
 * @see {@link audit}
 * @see {@link auditTime}
 *
 * @param delayDurationSelector A function that returns an `ObservableInput` for
 * each `value` emitted by the source Observable, which is then used to delay the
 * emission of that `value` on the output Observable until the `ObservableInput`
 * returned from this function emits a next value. When called, beside `value`,
 * this function receives a zero-based `index` of the emission order.
 * @param subscriptionDelay An Observable that triggers the subscription to the
 * source Observable once it emits any value.
 * @return A function that returns an Observable that delays the emissions of
 * the source Observable by an amount of time specified by the Observable
 * returned by `delayDurationSelector`.
 */
function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
        // DEPRECATED PATH
        return (source) => (0, concat_1.concat)(subscriptionDelay.pipe((0, take_1.take)(1), (0, ignoreElements_1.ignoreElements)()), source.pipe(delayWhen(delayDurationSelector)));
    }
    return (0, mergeMap_1.mergeMap)((value, index) => (0, innerFrom_1.innerFrom)(delayDurationSelector(value, index)).pipe((0, take_1.take)(1), (0, mapTo_1.mapTo)(value)));
}
