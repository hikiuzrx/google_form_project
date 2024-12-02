"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.last = last;
const EmptyError_1 = require("../util/EmptyError");
const filter_1 = require("./filter");
const takeLast_1 = require("./takeLast");
const throwIfEmpty_1 = require("./throwIfEmpty");
const defaultIfEmpty_1 = require("./defaultIfEmpty");
const identity_1 = require("../util/identity");
/**
 * Returns an Observable that emits only the last item emitted by the source Observable.
 * It optionally takes a predicate function as a parameter, in which case, rather than emitting
 * the last item from the source Observable, the resulting Observable will emit the last item
 * from the source Observable that satisfies the predicate.
 *
 * ![](last.png)
 *
 * It will throw an error if the source completes without notification or one that matches the predicate. It
 * returns the last value or if a predicate is provided last value that matches the predicate. It returns the
 * given default value if no notification is emitted or matches the predicate.
 *
 * ## Examples
 *
 * Last alphabet from the sequence
 *
 * ```ts
 * import { from, last } from 'rxjs';
 *
 * const source = from(['x', 'y', 'z']);
 * const result = source.pipe(last());
 *
 * result.subscribe(value => console.log(`Last alphabet: ${ value }`));
 *
 * // Outputs
 * // Last alphabet: z
 * ```
 *
 * Default value when the value in the predicate is not matched
 *
 * ```ts
 * import { from, last } from 'rxjs';
 *
 * const source = from(['x', 'y', 'z']);
 * const result = source.pipe(last(char => char === 'a', 'not found'));
 *
 * result.subscribe(value => console.log(`'a' is ${ value }.`));
 *
 * // Outputs
 * // 'a' is not found.
 * ```
 *
 * @see {@link skip}
 * @see {@link skipUntil}
 * @see {@link skipLast}
 * @see {@link skipWhile}
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 * @param {function} [predicate] - The condition any source emitted item has to satisfy.
 * @param {any} [defaultValue] - An optional default value to provide if last
 * predicate isn't met or no values were emitted.
 * @return A function that returns an Observable that emits only the last item
 * satisfying the given condition from the source, or a NoSuchElementException
 * if no such items are emitted.
 * @throws - Throws if no items that match the predicate are emitted by the source Observable.
 */
function last(predicate, defaultValue) {
    const hasDefaultValue = arguments.length >= 2;
    return (source) => source.pipe(predicate ? (0, filter_1.filter)((v, i) => predicate(v, i, source)) : identity_1.identity, (0, takeLast_1.takeLast)(1), hasDefaultValue ? (0, defaultIfEmpty_1.defaultIfEmpty)(defaultValue) : (0, throwIfEmpty_1.throwIfEmpty)(() => new EmptyError_1.EmptyError()));
}
