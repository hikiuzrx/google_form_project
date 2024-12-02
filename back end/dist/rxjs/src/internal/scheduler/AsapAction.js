"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsapAction = void 0;
const AsyncAction_1 = require("./AsyncAction");
const immediateProvider_1 = require("./immediateProvider");
class AsapAction extends AsyncAction_1.AsyncAction {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    requestAsyncId(scheduler, id, delay = 0) {
        // If delay is greater than 0, request as an async action.
        if (delay !== null && delay > 0) {
            return super.requestAsyncId(scheduler, id, delay);
        }
        // Push the action to the end of the scheduler queue.
        scheduler.actions.push(this);
        // If a microtask has already been scheduled, don't schedule another
        // one. If a microtask hasn't been scheduled yet, schedule one now. Return
        // the current scheduled microtask id.
        return scheduler._scheduled || (scheduler._scheduled = immediateProvider_1.immediateProvider.setImmediate(scheduler.flush.bind(scheduler, undefined)));
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        var _a;
        // If delay exists and is greater than 0, or if the delay is null (the
        // action wasn't rescheduled) but was originally scheduled as an async
        // action, then recycle as an async action.
        if (delay != null ? delay > 0 : this.delay > 0) {
            return super.recycleAsyncId(scheduler, id, delay);
        }
        // If the scheduler queue has no remaining actions with the same async id,
        // cancel the requested microtask and set the scheduled flag to undefined
        // so the next AsapAction will request its own.
        const { actions } = scheduler;
        if (id != null && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
            immediateProvider_1.immediateProvider.clearImmediate(id);
            if (scheduler._scheduled === id) {
                scheduler._scheduled = undefined;
            }
        }
        // Return undefined so the action knows to request a new async id if it's rescheduled.
        return undefined;
    }
}
exports.AsapAction = AsapAction;
