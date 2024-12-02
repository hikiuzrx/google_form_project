"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromSubscribable = fromSubscribable;
const Observable_1 = require("../Observable");
/**
 * Used to convert a subscribable to an observable.
 *
 * Currently, this is only used within internals.
 *
 * TODO: Discuss ObservableInput supporting "Subscribable".
 * https://github.com/ReactiveX/rxjs/issues/5909
 *
 * @param subscribable A subscribable
 */
function fromSubscribable(subscribable) {
    return new Observable_1.Observable((subscriber) => subscribable.subscribe(subscriber));
}
