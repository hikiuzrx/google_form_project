"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const identity_1 = require("../util/identity");
const isScheduler_1 = require("../util/isScheduler");
const defer_1 = require("./defer");
const scheduleIterable_1 = require("../scheduled/scheduleIterable");
function generate(initialStateOrOptions, condition, iterate, resultSelectorOrScheduler, scheduler) {
    let resultSelector;
    let initialState;
    // TODO: Remove this as we move away from deprecated signatures
    // and move towards a configuration object argument.
    if (arguments.length === 1) {
        // If we only have one argument, we can assume it is a configuration object.
        // Note that folks not using TypeScript may trip over this.
        ({
            initialState,
            condition,
            iterate,
            resultSelector = identity_1.identity,
            scheduler,
        } = initialStateOrOptions);
    }
    else {
        // Deprecated arguments path. Figure out what the user
        // passed and set it here.
        initialState = initialStateOrOptions;
        if (!resultSelectorOrScheduler || (0, isScheduler_1.isScheduler)(resultSelectorOrScheduler)) {
            resultSelector = identity_1.identity;
            scheduler = resultSelectorOrScheduler;
        }
        else {
            resultSelector = resultSelectorOrScheduler;
        }
    }
    // The actual generator used to "generate" values.
    function* gen() {
        for (let state = initialState; !condition || condition(state); state = iterate(state)) {
            yield resultSelector(state);
        }
    }
    // We use `defer` because we want to defer the creation of the iterator from the iterable.
    return (0, defer_1.defer)((scheduler
        ? // If a scheduler was provided, use `scheduleIterable` to ensure that iteration/generation
            // happens on the scheduler.
            () => (0, scheduleIterable_1.scheduleIterable)(gen(), scheduler)
        : // Otherwise, if there's no scheduler, we can just use the generator function directly in
            // `defer` and executing it will return the generator (which is iterable).
            gen));
}
