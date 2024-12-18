"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partition = partition;
const not_1 = require("../util/not");
const filter_1 = require("../operators/filter");
const innerFrom_1 = require("./innerFrom");
/**
 * Splits the source Observable into two, one with values that satisfy a
 * predicate, and another with values that don't satisfy the predicate.
 *
 * <span class="informal">It's like {@link filter}, but returns two Observables:
 * one like the output of {@link filter}, and the other with values that did not
 * pass the condition.</span>
 *
 * ![](partition.png)
 *
 * `partition` outputs an array with two Observables that partition the values
 * from the source Observable through the given `predicate` function. The first
 * Observable in that array emits source values for which the predicate argument
 * returns true. The second Observable emits source values for which the
 * predicate returns false. The first behaves like {@link filter} and the second
 * behaves like {@link filter} with the predicate negated.
 *
 * ## Example
 *
 * Partition a set of numbers into odds and evens observables
 *
 * ```ts
 * import { of, partition } from 'rxjs';
 *
 * const observableValues = of(1, 2, 3, 4, 5, 6);
 * const [evens$, odds$] = partition(observableValues, value => value % 2 === 0);
 *
 * odds$.subscribe(x => console.log('odds', x));
 * evens$.subscribe(x => console.log('evens', x));
 *
 * // Logs:
 * // odds 1
 * // odds 3
 * // odds 5
 * // evens 2
 * // evens 4
 * // evens 6
 * ```
 *
 * @see {@link filter}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates each value emitted by the source Observable. If it returns `true`,
 * the value is emitted on the first Observable in the returned array, if
 * `false` the value is emitted on the second Observable in the array. The
 * `index` parameter is the number `i` for the i-th source emission that has
 * happened since the subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {[Observable<T>, Observable<T>]} An array with two Observables: one
 * with values that passed the predicate, and another with values that did not
 * pass the predicate.
 */
function partition(source, predicate, thisArg) {
    return [(0, filter_1.filter)(predicate, thisArg)((0, innerFrom_1.innerFrom)(source)), (0, filter_1.filter)((0, not_1.not)(predicate, thisArg))((0, innerFrom_1.innerFrom)(source))];
}
