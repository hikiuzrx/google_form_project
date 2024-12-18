"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zip = zip;
const Observable_1 = require("../Observable");
const innerFrom_1 = require("./innerFrom");
const argsOrArgArray_1 = require("../util/argsOrArgArray");
const empty_1 = require("./empty");
const OperatorSubscriber_1 = require("../operators/OperatorSubscriber");
const args_1 = require("../util/args");
/**
 * Combines multiple Observables to create an Observable whose values are calculated from the values, in order, of each
 * of its input Observables.
 *
 * If the last parameter is a function, this function is used to compute the created value from the input values.
 * Otherwise, an array of the input values is returned.
 *
 * ## Example
 *
 * Combine age and name from different sources
 *
 * ```ts
 * import { of, zip, map } from 'rxjs';
 *
 * const age$ = of(27, 25, 29);
 * const name$ = of('Foo', 'Bar', 'Beer');
 * const isDev$ = of(true, true, false);
 *
 * zip(age$, name$, isDev$).pipe(
 *   map(([age, name, isDev]) => ({ age, name, isDev }))
 * )
 * .subscribe(x => console.log(x));
 *
 * // Outputs
 * // { age: 27, name: 'Foo', isDev: true }
 * // { age: 25, name: 'Bar', isDev: true }
 * // { age: 29, name: 'Beer', isDev: false }
 * ```
 *
 * @param sources
 * @return {Observable<R>}
 */
function zip(...args) {
    const resultSelector = (0, args_1.popResultSelector)(args);
    const sources = (0, argsOrArgArray_1.argsOrArgArray)(args);
    return sources.length
        ? new Observable_1.Observable((subscriber) => {
            // A collection of buffers of values from each source.
            // Keyed by the same index with which the sources were passed in.
            let buffers = sources.map(() => []);
            // An array of flags of whether or not the sources have completed.
            // This is used to check to see if we should complete the result.
            // Keyed by the same index with which the sources were passed in.
            let completed = sources.map(() => false);
            // When everything is done, release the arrays above.
            subscriber.add(() => {
                buffers = completed = null;
            });
            // Loop over our sources and subscribe to each one. The index `i` is
            // especially important here, because we use it in closures below to
            // access the related buffers and completion properties
            for (let sourceIndex = 0; !subscriber.closed && sourceIndex < sources.length; sourceIndex++) {
                (0, innerFrom_1.innerFrom)(sources[sourceIndex]).subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => {
                    buffers[sourceIndex].push(value);
                    // if every buffer has at least one value in it, then we
                    // can shift out the oldest value from each buffer and emit
                    // them as an array.
                    if (buffers.every((buffer) => buffer.length)) {
                        const result = buffers.map((buffer) => buffer.shift());
                        // Emit the array. If theres' a result selector, use that.
                        subscriber.next(resultSelector ? resultSelector(...result) : result);
                        // If any one of the sources is both complete and has an empty buffer
                        // then we complete the result. This is because we cannot possibly have
                        // any more values to zip together.
                        if (buffers.some((buffer, i) => !buffer.length && completed[i])) {
                            subscriber.complete();
                        }
                    }
                }, () => {
                    // This source completed. Mark it as complete so we can check it later
                    // if we have to.
                    completed[sourceIndex] = true;
                    // But, if this complete source has nothing in its buffer, then we
                    // can complete the result, because we can't possibly have any more
                    // values from this to zip together with the other values.
                    !buffers[sourceIndex].length && subscriber.complete();
                }));
            }
            // When everything is done, release the arrays above.
            return () => {
                buffers = completed = null;
            };
        })
        : empty_1.EMPTY;
}
