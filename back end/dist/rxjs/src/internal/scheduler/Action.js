"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const Subscription_1 = require("../Subscription");
/**
 * A unit of work to be executed in a `scheduler`. An action is typically
 * created from within a {@link SchedulerLike} and an RxJS user does not need to concern
 * themselves about creating and manipulating an Action.
 *
 * ```ts
 * class Action<T> extends Subscription {
 *   new (scheduler: Scheduler, work: (state?: T) => void);
 *   schedule(state?: T, delay: number = 0): Subscription;
 * }
 * ```
 *
 * @class Action<T>
 */
class Action extends Subscription_1.Subscription {
    constructor(scheduler, work) {
        super();
    }
    /**
     * Schedules this action on its parent {@link SchedulerLike} for execution. May be passed
     * some context object, `state`. May happen at some point in the future,
     * according to the `delay` parameter, if specified.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler.
     * @return {void}
     */
    schedule(state, delay = 0) {
        return this;
    }
}
exports.Action = Action;
