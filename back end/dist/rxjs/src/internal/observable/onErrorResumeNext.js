"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onErrorResumeNext = onErrorResumeNext;
const Observable_1 = require("../Observable");
const argsOrArgArray_1 = require("../util/argsOrArgArray");
const OperatorSubscriber_1 = require("../operators/OperatorSubscriber");
const noop_1 = require("../util/noop");
const innerFrom_1 = require("./innerFrom");
/* tslint:enable:max-line-length */
/**
 * When any of the provided Observable emits a complete or an error notification, it immediately subscribes to the next one
 * that was passed.
 *
 * <span class="informal">Execute series of Observables no matter what, even if it means swallowing errors.</span>
 *
 * ![](onErrorResumeNext.png)
 *
 * `onErrorResumeNext` will subscribe to each observable source it is provided, in order.
 * If the source it's subscribed to emits an error or completes, it will move to the next source
 * without error.
 *
 * If `onErrorResumeNext` is provided no arguments, or a single, empty array, it will return {@link EMPTY}.
 *
 * `onErrorResumeNext` is basically {@link concat}, only it will continue, even if one of its
 * sources emits an error.
 *
 * Note that there is no way to handle any errors thrown by sources via the result of
 * `onErrorResumeNext`. If you want to handle errors thrown in any given source, you can
 * always use the {@link catchError} operator on them before passing them into `onErrorResumeNext`.
 *
 * ## Example
 *
 * Subscribe to the next Observable after map fails
 *
 * ```ts
 * import { onErrorResumeNext, of, map } from 'rxjs';
 *
 * onErrorResumeNext(
 *   of(1, 2, 3, 0).pipe(
 *     map(x => {
 *       if (x === 0) {
 *         throw Error();
 *       }
 *       return 10 / x;
 *     })
 *   ),
 *   of(1, 2, 3)
 * )
 * .subscribe({
 *   next: value => console.log(value),
 *   error: err => console.log(err),     // Will never be called.
 *   complete: () => console.log('done')
 * });
 *
 * // Logs:
 * // 10
 * // 5
 * // 3.3333333333333335
 * // 1
 * // 2
 * // 3
 * // 'done'
 * ```
 *
 * @see {@link concat}
 * @see {@link catchError}
 *
 * @param {...ObservableInput} sources Observables (or anything that *is* observable) passed either directly or as an array.
 * @return {Observable} An Observable that concatenates all sources, one after the other,
 * ignoring all errors, such that any error causes it to move on to the next source.
 */
function onErrorResumeNext(...sources) {
    const nextSources = (0, argsOrArgArray_1.argsOrArgArray)(sources);
    return new Observable_1.Observable((subscriber) => {
        let sourceIndex = 0;
        const subscribeNext = () => {
            if (sourceIndex < nextSources.length) {
                let nextSource;
                try {
                    nextSource = (0, innerFrom_1.innerFrom)(nextSources[sourceIndex++]);
                }
                catch (err) {
                    subscribeNext();
                    return;
                }
                const innerSubscriber = new OperatorSubscriber_1.OperatorSubscriber(subscriber, undefined, noop_1.noop, noop_1.noop);
                nextSource.subscribe(innerSubscriber);
                innerSubscriber.add(subscribeNext);
            }
            else {
                subscriber.complete();
            }
        };
        subscribeNext();
    });
}
