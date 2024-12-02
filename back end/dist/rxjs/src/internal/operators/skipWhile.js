"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipWhile = skipWhile;
const lift_1 = require("../util/lift");
const OperatorSubscriber_1 = require("./OperatorSubscriber");
/**
 * Returns an Observable that skips all items emitted by the source Observable as long as a specified condition holds
 * true, but emits all further source items as soon as the condition becomes false.
 *
 * ![](skipWhile.png)
 *
 * Skips all the notifications with a truthy predicate. It will not skip the notifications when the predicate is falsy.
 * It can also be skipped using index. Once the predicate is true, it will not be called again.
 *
 * ## Example
 *
 * Skip some super heroes
 *
 * ```ts
 * import { from, skipWhile } from 'rxjs';
 *
 * const source = from(['Green Arrow', 'SuperMan', 'Flash', 'SuperGirl', 'Black Canary'])
 * // Skip the heroes until SuperGirl
 * const example = source.pipe(skipWhile(hero => hero !== 'SuperGirl'));
 * // output: SuperGirl, Black Canary
 * example.subscribe(femaleHero => console.log(femaleHero));
 * ```
 *
 * Skip values from the array until index 5
 *
 * ```ts
 * import { from, skipWhile } from 'rxjs';
 *
 * const source = from([1, 2, 3, 4, 5, 6, 7, 9, 10]);
 * const example = source.pipe(skipWhile((_, i) => i !== 5));
 * // output: 6, 7, 9, 10
 * example.subscribe(value => console.log(value));
 * ```
 *
 * @see {@link last}
 * @see {@link skip}
 * @see {@link skipUntil}
 * @see {@link skipLast}
 *
 * @param {Function} predicate - A function to test each item emitted from the source Observable.
 * @return A function that returns an Observable that begins emitting items
 * emitted by the source Observable when the specified predicate becomes false.
 */
function skipWhile(predicate) {
    return (0, lift_1.operate)((source, subscriber) => {
        let taking = false;
        let index = 0;
        source.subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => (taking || (taking = !predicate(value, index++))) && subscriber.next(value)));
    });
}
