"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.race = race;
exports.raceInit = raceInit;
const Observable_1 = require("../Observable");
const innerFrom_1 = require("./innerFrom");
const argsOrArgArray_1 = require("../util/argsOrArgArray");
const OperatorSubscriber_1 = require("../operators/OperatorSubscriber");
/**
 * Returns an observable that mirrors the first source observable to emit an item.
 *
 * ![](race.png)
 *
 * `race` returns an observable, that when subscribed to, subscribes to all source observables immediately.
 * As soon as one of the source observables emits a value, the result unsubscribes from the other sources.
 * The resulting observable will forward all notifications, including error and completion, from the "winning"
 * source observable.
 *
 * If one of the used source observable throws an errors before a first notification
 * the race operator will also throw an error, no matter if another source observable
 * could potentially win the race.
 *
 * `race` can be useful for selecting the response from the fastest network connection for
 * HTTP or WebSockets. `race` can also be useful for switching observable context based on user
 * input.
 *
 * ## Example
 *
 * Subscribes to the observable that was the first to start emitting.
 *
 * ```ts
 * import { interval, map, race } from 'rxjs';
 *
 * const obs1 = interval(7000).pipe(map(() => 'slow one'));
 * const obs2 = interval(3000).pipe(map(() => 'fast one'));
 * const obs3 = interval(5000).pipe(map(() => 'medium one'));
 *
 * race(obs1, obs2, obs3)
 *   .subscribe(winner => console.log(winner));
 *
 * // Outputs
 * // a series of 'fast one'
 * ```
 *
 * @param {...Observables} ...observables sources used to race for which Observable emits first.
 * @return {Observable} an Observable that mirrors the output of the first Observable to emit an item.
 */
function race(...sources) {
    sources = (0, argsOrArgArray_1.argsOrArgArray)(sources);
    // If only one source was passed, just return it. Otherwise return the race.
    return sources.length === 1 ? (0, innerFrom_1.innerFrom)(sources[0]) : new Observable_1.Observable(raceInit(sources));
}
/**
 * An observable initializer function for both the static version and the
 * operator version of race.
 * @param sources The sources to race
 */
function raceInit(sources) {
    return (subscriber) => {
        let subscriptions = [];
        // Subscribe to all of the sources. Note that we are checking `subscriptions` here
        // Is is an array of all actively "racing" subscriptions, and it is `null` after the
        // race has been won. So, if we have racer that synchronously "wins", this loop will
        // stop before it subscribes to any more.
        for (let i = 0; subscriptions && !subscriber.closed && i < sources.length; i++) {
            subscriptions.push((0, innerFrom_1.innerFrom)(sources[i]).subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => {
                if (subscriptions) {
                    // We're still racing, but we won! So unsubscribe
                    // all other subscriptions that we have, except this one.
                    for (let s = 0; s < subscriptions.length; s++) {
                        s !== i && subscriptions[s].unsubscribe();
                    }
                    subscriptions = null;
                }
                subscriber.next(value);
            })));
        }
    };
}
