"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueAction = void 0;
const AsyncAction_1 = require("./AsyncAction");
class QueueAction extends AsyncAction_1.AsyncAction {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    schedule(state, delay = 0) {
        if (delay > 0) {
            return super.schedule(state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    }
    execute(state, delay) {
        return delay > 0 || this.closed ? super.execute(state, delay) : this._execute(state, delay);
    }
    requestAsyncId(scheduler, id, delay = 0) {
        // If delay exists and is greater than 0, or if the delay is null (the
        // action wasn't rescheduled) but was originally scheduled as an async
        // action, then recycle as an async action.
        if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
            return super.requestAsyncId(scheduler, id, delay);
        }
        // Otherwise flush the scheduler starting with this action.
        scheduler.flush(this);
        // HACK: In the past, this was returning `void`. However, `void` isn't a valid
        // `TimerHandle`, and generally the return value here isn't really used. So the
        // compromise is to return `0` which is both "falsy" and a valid `TimerHandle`,
        // as opposed to refactoring every other instanceo of `requestAsyncId`.
        return 0;
    }
}
exports.QueueAction = QueueAction;
