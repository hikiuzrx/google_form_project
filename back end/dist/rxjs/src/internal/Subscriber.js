"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_OBSERVER = exports.SafeSubscriber = exports.Subscriber = void 0;
const isFunction_1 = require("./util/isFunction");
const Subscription_1 = require("./Subscription");
const config_1 = require("./config");
const reportUnhandledError_1 = require("./util/reportUnhandledError");
const noop_1 = require("./util/noop");
const NotificationFactories_1 = require("./NotificationFactories");
const timeoutProvider_1 = require("./scheduler/timeoutProvider");
const errorContext_1 = require("./util/errorContext");
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
class Subscriber extends Subscription_1.Subscription {
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param next The `next` callback of an Observer.
     * @param error The `error` callback of an
     * Observer.
     * @param complete The `complete` callback of an
     * Observer.
     * @return A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     * @nocollapse
     * @deprecated Do not use. Will be removed in v8. There is no replacement for this
     * method, and there is no reason to be creating instances of `Subscriber` directly.
     * If you have a specific use case, please file an issue.
     */
    static create(next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    }
    /**
     * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
     * There is no reason to directly create an instance of Subscriber. This type is exported for typings reasons.
     */
    constructor(destination) {
        super();
        /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
        this.isStopped = false;
        if (destination) {
            this.destination = destination;
            // Automatically chain subscriptions together here.
            // if destination is a Subscription, then it is a Subscriber.
            if ((0, Subscription_1.isSubscription)(destination)) {
                destination.add(this);
            }
        }
        else {
            this.destination = exports.EMPTY_OBSERVER;
        }
    }
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    next(value) {
        if (this.isStopped) {
            handleStoppedNotification((0, NotificationFactories_1.nextNotification)(value), this);
        }
        else {
            this._next(value);
        }
    }
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached `Error`. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    error(err) {
        if (this.isStopped) {
            handleStoppedNotification((0, NotificationFactories_1.errorNotification)(err), this);
        }
        else {
            this.isStopped = true;
            this._error(err);
        }
    }
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    complete() {
        if (this.isStopped) {
            handleStoppedNotification(NotificationFactories_1.COMPLETE_NOTIFICATION, this);
        }
        else {
            this.isStopped = true;
            this._complete();
        }
    }
    unsubscribe() {
        if (!this.closed) {
            this.isStopped = true;
            super.unsubscribe();
            this.destination = null;
        }
    }
    _next(value) {
        this.destination.next(value);
    }
    _error(err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    }
    _complete() {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    }
}
exports.Subscriber = Subscriber;
/**
 * This bind is captured here because we want to be able to have
 * compatibility with monoid libraries that tend to use a method named
 * `bind`. In particular, a library called Monio requires this.
 */
const _bind = Function.prototype.bind;
function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
}
/**
 * Internal optimization only, DO NOT EXPOSE.
 * @internal
 */
class ConsumerObserver {
    constructor(partialObserver) {
        this.partialObserver = partialObserver;
    }
    next(value) {
        const { partialObserver } = this;
        if (partialObserver.next) {
            try {
                partialObserver.next(value);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    }
    error(err) {
        const { partialObserver } = this;
        if (partialObserver.error) {
            try {
                partialObserver.error(err);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
        else {
            handleUnhandledError(err);
        }
    }
    complete() {
        const { partialObserver } = this;
        if (partialObserver.complete) {
            try {
                partialObserver.complete();
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    }
}
class SafeSubscriber extends Subscriber {
    constructor(observerOrNext, error, complete) {
        super();
        let partialObserver;
        if ((0, isFunction_1.isFunction)(observerOrNext) || !observerOrNext) {
            // The first argument is a function, not an observer. The next
            // two arguments *could* be observers, or they could be empty.
            partialObserver = {
                next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                error: error !== null && error !== void 0 ? error : undefined,
                complete: complete !== null && complete !== void 0 ? complete : undefined,
            };
        }
        else {
            // The first argument is a partial observer.
            let context;
            if (this && config_1.config.useDeprecatedNextContext) {
                // This is a deprecated path that made `this.unsubscribe()` available in
                // next handler functions passed to subscribe. This only exists behind a flag
                // now, as it is *very* slow.
                context = Object.create(observerOrNext);
                context.unsubscribe = () => this.unsubscribe();
                partialObserver = {
                    next: observerOrNext.next && bind(observerOrNext.next, context),
                    error: observerOrNext.error && bind(observerOrNext.error, context),
                    complete: observerOrNext.complete && bind(observerOrNext.complete, context),
                };
            }
            else {
                // The "normal" path. Just use the partial observer directly.
                partialObserver = observerOrNext;
            }
        }
        // Wrap the partial observer to ensure it's a full observer, and
        // make sure proper error handling is accounted for.
        this.destination = new ConsumerObserver(partialObserver);
    }
}
exports.SafeSubscriber = SafeSubscriber;
function handleUnhandledError(error) {
    if (config_1.config.useDeprecatedSynchronousErrorHandling) {
        (0, errorContext_1.captureError)(error);
    }
    else {
        // Ideal path, we report this as an unhandled error,
        // which is thrown on a new call stack.
        (0, reportUnhandledError_1.reportUnhandledError)(error);
    }
}
/**
 * An error handler used when no error handler was supplied
 * to the SafeSubscriber -- meaning no error handler was supplied
 * do the `subscribe` call on our observable.
 * @param err The error to handle
 */
function defaultErrorHandler(err) {
    throw err;
}
/**
 * A handler for notifications that cannot be sent to a stopped subscriber.
 * @param notification The notification being sent
 * @param subscriber The stopped subscriber
 */
function handleStoppedNotification(notification, subscriber) {
    const { onStoppedNotification } = config_1.config;
    onStoppedNotification && timeoutProvider_1.timeoutProvider.setTimeout(() => onStoppedNotification(notification, subscriber));
}
/**
 * The observer used as a stub for subscriptions where the user did not
 * pass any arguments to `subscribe`. Comes with the default error handling
 * behavior.
 */
exports.EMPTY_OBSERVER = {
    closed: true,
    next: noop_1.noop,
    error: defaultErrorHandler,
    complete: noop_1.noop,
};
