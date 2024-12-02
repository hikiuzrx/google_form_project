"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multicast = multicast;
const ConnectableObservable_1 = require("../observable/ConnectableObservable");
const isFunction_1 = require("../util/isFunction");
const connect_1 = require("./connect");
/**
 * @deprecated Will be removed in v8. Use the {@link connectable} observable, the {@link connect} operator or the
 * {@link share} operator instead. See the overloads below for equivalent replacement examples of this operator's
 * behaviors.
 * Details: https://rxjs.dev/deprecations/multicasting
 */
function multicast(subjectOrSubjectFactory, selector) {
    const subjectFactory = (0, isFunction_1.isFunction)(subjectOrSubjectFactory) ? subjectOrSubjectFactory : () => subjectOrSubjectFactory;
    if ((0, isFunction_1.isFunction)(selector)) {
        // If a selector function is provided, then we're a "normal" operator that isn't
        // going to return a ConnectableObservable. We can use `connect` to do what we
        // need to do.
        return (0, connect_1.connect)(selector, {
            connector: subjectFactory,
        });
    }
    return (source) => new ConnectableObservable_1.ConnectableObservable(source, subjectFactory);
}
