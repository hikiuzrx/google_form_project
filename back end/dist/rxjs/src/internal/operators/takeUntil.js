"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeUntil = takeUntil;
const lift_1 = require("../util/lift");
const OperatorSubscriber_1 = require("./OperatorSubscriber");
const innerFrom_1 = require("../observable/innerFrom");
const noop_1 = require("../util/noop");
/**
 * Emits the values emitted by the source Observable until a `notifier`
 * Observable emits a value.
 *
 * <span class="informal">Lets values pass until a second Observable,
 * `notifier`, emits a value. Then, it completes.</span>
 *
 * ![](takeUntil.png)
 *
 * `takeUntil` subscribes and begins mirroring the source Observable. It also
 * monitors a second Observable, `notifier` that you provide. If the `notifier`
 * emits a value, the output Observable stops mirroring the source Observable
 * and completes. If the `notifier` doesn't emit any value and completes
 * then `takeUntil` will pass all values.
 *
 * ## Example
 *
 * Tick every second until the first click happens
 *
 * ```ts
 * import { interval, fromEvent, takeUntil } from 'rxjs';
 *
 * const source = interval(1000);
 * const clicks = fromEvent(document, 'click');
 * const result = source.pipe(takeUntil(clicks));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @param {Observable} notifier The Observable whose first emitted value will
 * cause the output Observable of `takeUntil` to stop emitting values from the
 * source Observable.
 * @return A function that returns an Observable that emits the values from the
 * source Observable until `notifier` emits its first value.
 */
function takeUntil(notifier) {
    return (0, lift_1.operate)((source, subscriber) => {
        (0, innerFrom_1.innerFrom)(notifier).subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, () => subscriber.complete(), noop_1.noop));
        !subscriber.closed && source.subscribe(subscriber);
    });
}
