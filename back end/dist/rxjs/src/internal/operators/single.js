"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.single = single;
const EmptyError_1 = require("../util/EmptyError");
const SequenceError_1 = require("../util/SequenceError");
const NotFoundError_1 = require("../util/NotFoundError");
const lift_1 = require("../util/lift");
const OperatorSubscriber_1 = require("./OperatorSubscriber");
/**
 * Returns an observable that asserts that only one value is
 * emitted from the observable that matches the predicate. If no
 * predicate is provided, then it will assert that the observable
 * only emits one value.
 *
 * In the event that the observable is empty, it will throw an
 * {@link EmptyError}.
 *
 * In the event that two values are found that match the predicate,
 * or when there are two values emitted and no predicate, it will
 * throw a {@link SequenceError}
 *
 * In the event that no values match the predicate, if one is provided,
 * it will throw a {@link NotFoundError}
 *
 * ## Example
 *
 * Expect only `name` beginning with `'B'`
 *
 * ```ts
 * import { of, single } from 'rxjs';
 *
 * const source1 = of(
 *  { name: 'Ben' },
 *  { name: 'Tracy' },
 *  { name: 'Laney' },
 *  { name: 'Lily' }
 * );
 *
 * source1
 *   .pipe(single(x => x.name.startsWith('B')))
 *   .subscribe(x => console.log(x));
 * // Emits 'Ben'
 *
 *
 * const source2 = of(
 *  { name: 'Ben' },
 *  { name: 'Tracy' },
 *  { name: 'Bradley' },
 *  { name: 'Lincoln' }
 * );
 *
 * source2
 *   .pipe(single(x => x.name.startsWith('B')))
 *   .subscribe({ error: err => console.error(err) });
 * // Error emitted: SequenceError('Too many values match')
 *
 *
 * const source3 = of(
 *  { name: 'Laney' },
 *  { name: 'Tracy' },
 *  { name: 'Lily' },
 *  { name: 'Lincoln' }
 * );
 *
 * source3
 *   .pipe(single(x => x.name.startsWith('B')))
 *   .subscribe({ error: err => console.error(err) });
 * // Error emitted: NotFoundError('No values match')
 * ```
 *
 * @see {@link first}
 * @see {@link find}
 * @see {@link findIndex}
 * @see {@link elementAt}
 *
 * @throws {NotFoundError} Delivers an NotFoundError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 * @throws {SequenceError} Delivers a SequenceError if more than one value is emitted that matches the
 * provided predicate. If no predicate is provided, will deliver a SequenceError if more
 * than one value comes from the source
 * @param {Function} predicate - A predicate function to evaluate items emitted by the source Observable.
 * @return A function that returns an Observable that emits the single item
 * emitted by the source Observable that matches the predicate.
 */
function single(predicate) {
    return (0, lift_1.operate)((source, subscriber) => {
        let hasValue = false;
        let singleValue;
        let seenValue = false;
        let index = 0;
        source.subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => {
            seenValue = true;
            if (!predicate || predicate(value, index++, source)) {
                hasValue && subscriber.error(new SequenceError_1.SequenceError('Too many matching values'));
                hasValue = true;
                singleValue = value;
            }
        }, () => {
            if (hasValue) {
                subscriber.next(singleValue);
                subscriber.complete();
            }
            else {
                subscriber.error(seenValue ? new NotFoundError_1.NotFoundError('No matching values') : new EmptyError_1.EmptyError());
            }
        }));
    });
}
