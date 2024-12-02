"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchMapTo = switchMapTo;
const switchMap_1 = require("./switchMap");
const isFunction_1 = require("../util/isFunction");
/**
 * Projects each source value to the same Observable which is flattened multiple
 * times with {@link switchMap} in the output Observable.
 *
 * <span class="informal">It's like {@link switchMap}, but maps each value
 * always to the same inner Observable.</span>
 *
 * ![](switchMapTo.png)
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then flattens those resulting Observables into one
 * single Observable, which is the output Observable. The output Observables
 * emits values only from the most recently emitted instance of
 * `innerObservable`.
 *
 * ## Example
 *
 * Restart an interval Observable on every click event
 *
 * ```ts
 * import { fromEvent, switchMapTo, interval } from 'rxjs';
 *
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(switchMapTo(interval(1000)));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link concatMapTo}
 * @see {@link switchAll}
 * @see {@link switchMap}
 * @see {@link mergeMapTo}
 *
 * @param {ObservableInput} innerObservable An Observable to replace each value from
 * the source Observable.
 * @return A function that returns an Observable that emits items from the
 * given `innerObservable` (and optionally transformed through the deprecated
 * `resultSelector`) every time a value is emitted on the source Observable,
 * and taking only the values from the most recently projected inner
 * Observable.
 * @deprecated Will be removed in v9. Use {@link switchMap} instead: `switchMap(() => result)`
 */
function switchMapTo(innerObservable, resultSelector) {
    return (0, isFunction_1.isFunction)(resultSelector) ? (0, switchMap_1.switchMap)(() => innerObservable, resultSelector) : (0, switchMap_1.switchMap)(() => innerObservable);
}
