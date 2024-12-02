"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWith = startWith;
const concat_1 = require("../observable/concat");
const args_1 = require("../util/args");
const lift_1 = require("../util/lift");
/**
 * Returns an observable that, at the moment of subscription, will synchronously emit all
 * values provided to this operator, then subscribe to the source and mirror all of its emissions
 * to subscribers.
 *
 * This is a useful way to know when subscription has occurred on an existing observable.
 *
 * <span class="informal">First emits its arguments in order, and then any
 * emissions from the source.</span>
 *
 * ![](startWith.png)
 *
 * ## Examples
 *
 * Emit a value when a timer starts.
 *
 * ```ts
 * import { timer, map, startWith } from 'rxjs';
 *
 * timer(1000)
 *   .pipe(
 *     map(() => 'timer emit'),
 *     startWith('timer start')
 *   )
 *   .subscribe(x => console.log(x));
 *
 * // results:
 * // 'timer start'
 * // 'timer emit'
 * ```
 *
 * @param values Items you want the modified Observable to emit first.
 * @return A function that returns an Observable that synchronously emits
 * provided values before subscribing to the source Observable.
 *
 * @see {@link endWith}
 * @see {@link finalize}
 * @see {@link concat}
 */
function startWith(...values) {
    const scheduler = (0, args_1.popScheduler)(values);
    return (0, lift_1.operate)((source, subscriber) => {
        // Here we can't pass `undefined` as a scheduler, because if we did, the
        // code inside of `concat` would be confused by the `undefined`, and treat it
        // like an invalid observable. So we have to split it two different ways.
        (scheduler ? (0, concat_1.concat)(values, source, scheduler) : (0, concat_1.concat)(values, source)).subscribe(subscriber);
    });
}
