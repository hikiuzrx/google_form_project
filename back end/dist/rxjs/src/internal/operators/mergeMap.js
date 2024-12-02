"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeMap = mergeMap;
const map_1 = require("./map");
const innerFrom_1 = require("../observable/innerFrom");
const lift_1 = require("../util/lift");
const mergeInternals_1 = require("./mergeInternals");
const isFunction_1 = require("../util/isFunction");
/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link mergeAll}.</span>
 *
 * ![](mergeMap.png)
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger.
 *
 * ## Example
 *
 * Map and flatten each letter to an Observable ticking every 1 second
 *
 * ```ts
 * import { of, mergeMap, interval, map } from 'rxjs';
 *
 * const letters = of('a', 'b', 'c');
 * const result = letters.pipe(
 *   mergeMap(x => interval(1000).pipe(map(i => x + i)))
 * );
 *
 * result.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // a0
 * // b0
 * // c0
 * // a1
 * // b1
 * // c1
 * // continues to list a, b, c every second with respective ascending integers
 * ```
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {number} [concurrent=Infinity] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return A function that returns an Observable that emits the result of
 * applying the projection function (and the optional deprecated
 * `resultSelector`) to each item emitted by the source Observable and merging
 * the results of the Observables obtained from this transformation.
 */
function mergeMap(project, resultSelector, concurrent = Infinity) {
    if ((0, isFunction_1.isFunction)(resultSelector)) {
        // DEPRECATED PATH
        return mergeMap((a, i) => (0, map_1.map)((b, ii) => resultSelector(a, b, i, ii))((0, innerFrom_1.innerFrom)(project(a, i))), concurrent);
    }
    else if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
    }
    return (0, lift_1.operate)((source, subscriber) => (0, mergeInternals_1.mergeInternals)(source, subscriber, project, concurrent));
}
