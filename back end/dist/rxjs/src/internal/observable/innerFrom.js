"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.innerFrom = innerFrom;
exports.fromInteropObservable = fromInteropObservable;
exports.fromArrayLike = fromArrayLike;
exports.fromPromise = fromPromise;
exports.fromIterable = fromIterable;
exports.fromAsyncIterable = fromAsyncIterable;
exports.fromReadableStreamLike = fromReadableStreamLike;
const isArrayLike_1 = require("../util/isArrayLike");
const isPromise_1 = require("../util/isPromise");
const Observable_1 = require("../Observable");
const isInteropObservable_1 = require("../util/isInteropObservable");
const isAsyncIterable_1 = require("../util/isAsyncIterable");
const throwUnobservableError_1 = require("../util/throwUnobservableError");
const isIterable_1 = require("../util/isIterable");
const isReadableStreamLike_1 = require("../util/isReadableStreamLike");
const isFunction_1 = require("../util/isFunction");
const reportUnhandledError_1 = require("../util/reportUnhandledError");
const observable_1 = require("../symbol/observable");
function innerFrom(input) {
    if (input instanceof Observable_1.Observable) {
        return input;
    }
    if (input != null) {
        if ((0, isInteropObservable_1.isInteropObservable)(input)) {
            return fromInteropObservable(input);
        }
        if ((0, isArrayLike_1.isArrayLike)(input)) {
            return fromArrayLike(input);
        }
        if ((0, isPromise_1.isPromise)(input)) {
            return fromPromise(input);
        }
        if ((0, isAsyncIterable_1.isAsyncIterable)(input)) {
            return fromAsyncIterable(input);
        }
        if ((0, isIterable_1.isIterable)(input)) {
            return fromIterable(input);
        }
        if ((0, isReadableStreamLike_1.isReadableStreamLike)(input)) {
            return fromReadableStreamLike(input);
        }
    }
    throw (0, throwUnobservableError_1.createInvalidObservableTypeError)(input);
}
/**
 * Creates an RxJS Observable from an object that implements `Symbol.observable`.
 * @param obj An object that properly implements `Symbol.observable`.
 */
function fromInteropObservable(obj) {
    return new Observable_1.Observable((subscriber) => {
        const obs = obj[observable_1.observable]();
        if ((0, isFunction_1.isFunction)(obs.subscribe)) {
            return obs.subscribe(subscriber);
        }
        // Should be caught by observable subscribe function error handling.
        throw new TypeError('Provided object does not correctly implement Symbol.observable');
    });
}
/**
 * Synchronously emits the values of an array like and completes.
 * This is exported because there are creation functions and operators that need to
 * make direct use of the same logic, and there's no reason to make them run through
 * `from` conditionals because we *know* they're dealing with an array.
 * @param array The array to emit values from
 */
function fromArrayLike(array) {
    return new Observable_1.Observable((subscriber) => {
        // Loop over the array and emit each value. Note two things here:
        // 1. We're making sure that the subscriber is not closed on each loop.
        //    This is so we don't continue looping over a very large array after
        //    something like a `take`, `takeWhile`, or other synchronous unsubscription
        //    has already unsubscribed.
        // 2. In this form, reentrant code can alter that array we're looping over.
        //    This is a known issue, but considered an edge case. The alternative would
        //    be to copy the array before executing the loop, but this has
        //    performance implications.
        for (let i = 0; i < array.length && !subscriber.closed; i++) {
            subscriber.next(array[i]);
        }
        subscriber.complete();
    });
}
function fromPromise(promise) {
    return new Observable_1.Observable((subscriber) => {
        promise
            .then((value) => {
            if (!subscriber.closed) {
                subscriber.next(value);
                subscriber.complete();
            }
        }, (err) => subscriber.error(err))
            .then(null, reportUnhandledError_1.reportUnhandledError);
    });
}
function fromIterable(iterable) {
    return new Observable_1.Observable((subscriber) => {
        for (const value of iterable) {
            subscriber.next(value);
            if (subscriber.closed) {
                return;
            }
        }
        subscriber.complete();
    });
}
function fromAsyncIterable(asyncIterable) {
    return new Observable_1.Observable((subscriber) => {
        process(asyncIterable, subscriber).catch((err) => subscriber.error(err));
    });
}
function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable((0, isReadableStreamLike_1.readableStreamLikeToAsyncGenerator)(readableStream));
}
function process(asyncIterable, subscriber) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, asyncIterable_1, asyncIterable_1_1;
        var _b, e_1, _c, _d;
        try {
            for (_a = true, asyncIterable_1 = __asyncValues(asyncIterable); asyncIterable_1_1 = yield asyncIterable_1.next(), _b = asyncIterable_1_1.done, !_b; _a = true) {
                _d = asyncIterable_1_1.value;
                _a = false;
                const value = _d;
                subscriber.next(value);
                // A side-effect may have closed our subscriber,
                // check before the next iteration.
                if (subscriber.closed) {
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = asyncIterable_1.return)) yield _c.call(asyncIterable_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        subscriber.complete();
    });
}
