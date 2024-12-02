"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timer = timer;
const Observable_1 = require("../Observable");
const async_1 = require("../scheduler/async");
const isScheduler_1 = require("../util/isScheduler");
const isDate_1 = require("../util/isDate");
function timer(dueTime = 0, intervalOrScheduler, scheduler = async_1.async) {
    // Since negative intervalDuration is treated as though no
    // interval was specified at all, we start with a negative number.
    let intervalDuration = -1;
    if (intervalOrScheduler != null) {
        // If we have a second argument, and it's a scheduler,
        // override the scheduler we had defaulted. Otherwise,
        // it must be an interval.
        if ((0, isScheduler_1.isScheduler)(intervalOrScheduler)) {
            scheduler = intervalOrScheduler;
        }
        else {
            // Note that this *could* be negative, in which case
            // it's like not passing an intervalDuration at all.
            intervalDuration = intervalOrScheduler;
        }
    }
    return new Observable_1.Observable((subscriber) => {
        // If a valid date is passed, calculate how long to wait before
        // executing the first value... otherwise, if it's a number just schedule
        // that many milliseconds (or scheduler-specified unit size) in the future.
        let due = (0, isDate_1.isValidDate)(dueTime) ? +dueTime - scheduler.now() : dueTime;
        if (due < 0) {
            // Ensure we don't schedule in the future.
            due = 0;
        }
        // The incrementing value we emit.
        let n = 0;
        // Start the timer.
        return scheduler.schedule(function () {
            if (!subscriber.closed) {
                // Emit the next value and increment.
                subscriber.next(n++);
                if (0 <= intervalDuration) {
                    // If we have a interval after the initial timer,
                    // reschedule with the period.
                    this.schedule(undefined, intervalDuration);
                }
                else {
                    // We didn't have an interval. So just complete.
                    subscriber.complete();
                }
            }
        }, due);
    });
}
