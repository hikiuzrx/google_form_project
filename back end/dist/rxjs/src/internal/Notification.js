"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.NotificationKind = void 0;
exports.observeNotification = observeNotification;
const empty_1 = require("./observable/empty");
const of_1 = require("./observable/of");
const throwError_1 = require("./observable/throwError");
const isFunction_1 = require("./util/isFunction");
// TODO: When this enum is removed, replace it with a type alias. See #4556.
/**
 * @deprecated Use a string literal instead. `NotificationKind` will be replaced with a type alias in v8.
 * It will not be replaced with a const enum as those are not compatible with isolated modules.
 */
var NotificationKind;
(function (NotificationKind) {
    NotificationKind["NEXT"] = "N";
    NotificationKind["ERROR"] = "E";
    NotificationKind["COMPLETE"] = "C";
})(NotificationKind || (exports.NotificationKind = NotificationKind = {}));
/**
 * Represents a push-based event or value that an {@link Observable} can emit.
 * This class is particularly useful for operators that manage notifications,
 * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
 * others. Besides wrapping the actual delivered value, it also annotates it
 * with metadata of, for instance, what type of push message it is (`next`,
 * `error`, or `complete`).
 *
 * @see {@link materialize}
 * @see {@link dematerialize}
 * @see {@link observeOn}
 * @deprecated It is NOT recommended to create instances of `Notification` directly.
 * Rather, try to create POJOs matching the signature outlined in {@link ObservableNotification}.
 * For example: `{ kind: 'N', value: 1 }`, `{ kind: 'E', error: new Error('bad') }`, or `{ kind: 'C' }`.
 * Will be removed in v8.
 */
class Notification {
    constructor(kind, value, error) {
        this.kind = kind;
        this.value = value;
        this.error = error;
        this.hasValue = kind === 'N';
    }
    /**
     * Executes the appropriate handler on a passed `observer` given the `kind` of notification.
     * If the handler is missing it will do nothing. Even if the notification is an error, if
     * there is no error handler on the observer, an error will not be thrown, it will noop.
     * @param observer The observer to notify.
     */
    observe(observer) {
        return observeNotification(this, observer);
    }
    do(nextHandler, errorHandler, completeHandler) {
        const { kind, value, error } = this;
        return kind === 'N' ? nextHandler === null || nextHandler === void 0 ? void 0 : nextHandler(value) : kind === 'E' ? errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler(error) : completeHandler === null || completeHandler === void 0 ? void 0 : completeHandler();
    }
    accept(nextOrObserver, error, complete) {
        return (0, isFunction_1.isFunction)(nextOrObserver === null || nextOrObserver === void 0 ? void 0 : nextOrObserver.next)
            ? this.observe(nextOrObserver)
            : this.do(nextOrObserver, error, complete);
    }
    /**
     * Returns a simple Observable that just delivers the notification represented
     * by this Notification instance.
     *
     * @deprecated Will be removed in v8. To convert a `Notification` to an {@link Observable},
     * use {@link of} and {@link dematerialize}: `of(notification).pipe(dematerialize())`.
     */
    toObservable() {
        const { kind, value, error } = this;
        // Select the observable to return by `kind`
        const result = kind === 'N'
            ? // Next kind. Return an observable of that value.
                (0, of_1.of)(value)
            : //
                kind === 'E'
                    ? // Error kind. Return an observable that emits the error.
                        (0, throwError_1.throwError)(() => error)
                    : //
                        kind === 'C'
                            ? // Completion kind. Kind is "C", return an observable that just completes.
                                empty_1.EMPTY
                            : // Unknown kind, return falsy, so we error below.
                                0;
        if (!result) {
            // TODO: consider removing this check. The only way to cause this would be to
            // use the Notification constructor directly in a way that is not type-safe.
            // and direct use of the Notification constructor is deprecated.
            throw new TypeError(`Unexpected notification kind ${kind}`);
        }
        return result;
    }
    /**
     * A shortcut to create a Notification instance of the type `next` from a
     * given value.
     * @param {T} value The `next` value.
     * @return {Notification<T>} The "next" Notification representing the
     * argument.
     * @nocollapse
     * @deprecated It is NOT recommended to create instances of `Notification` directly.
     * Rather, try to create POJOs matching the signature outlined in {@link ObservableNotification}.
     * For example: `{ kind: 'N', value: 1 }`, `{ kind: 'E', error: new Error('bad') }`, or `{ kind: 'C' }`.
     * Will be removed in v8.
     */
    static createNext(value) {
        return new Notification('N', value);
    }
    /**
     * A shortcut to create a Notification instance of the type `error` from a
     * given error.
     * @param {any} [err] The `error` error.
     * @return {Notification<T>} The "error" Notification representing the
     * argument.
     * @nocollapse
     * @deprecated It is NOT recommended to create instances of `Notification` directly.
     * Rather, try to create POJOs matching the signature outlined in {@link ObservableNotification}.
     * For example: `{ kind: 'N', value: 1 }`, `{ kind: 'E', error: new Error('bad') }`, or `{ kind: 'C' }`.
     * Will be removed in v8.
     */
    static createError(err) {
        return new Notification('E', undefined, err);
    }
    /**
     * A shortcut to create a Notification instance of the type `complete`.
     * @return {Notification<any>} The valueless "complete" Notification.
     * @nocollapse
     * @deprecated It is NOT recommended to create instances of `Notification` directly.
     * Rather, try to create POJOs matching the signature outlined in {@link ObservableNotification}.
     * For example: `{ kind: 'N', value: 1 }`, `{ kind: 'E', error: new Error('bad') }`, or `{ kind: 'C' }`.
     * Will be removed in v8.
     */
    static createComplete() {
        return Notification.completeNotification;
    }
}
exports.Notification = Notification;
Notification.completeNotification = new Notification('C');
/**
 * Executes the appropriate handler on a passed `observer` given the `kind` of notification.
 * If the handler is missing it will do nothing. Even if the notification is an error, if
 * there is no error handler on the observer, an error will not be thrown, it will noop.
 * @param notification The notification object to observe.
 * @param observer The observer to notify.
 */
function observeNotification(notification, observer) {
    var _a, _b, _c;
    const { kind, value, error } = notification;
    if (typeof kind !== 'string') {
        throw new TypeError('Invalid notification, missing "kind"');
    }
    kind === 'N' ? (_a = observer.next) === null || _a === void 0 ? void 0 : _a.call(observer, value) : kind === 'E' ? (_b = observer.error) === null || _b === void 0 ? void 0 : _b.call(observer, error) : (_c = observer.complete) === null || _c === void 0 ? void 0 : _c.call(observer);
}
