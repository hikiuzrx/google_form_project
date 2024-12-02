"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnonymousSubject = exports.Subject = void 0;
const Observable_1 = require("./Observable");
const Subscription_1 = require("./Subscription");
const ObjectUnsubscribedError_1 = require("./util/ObjectUnsubscribedError");
const arrRemove_1 = require("./util/arrRemove");
const errorContext_1 = require("./util/errorContext");
/**
 * A Subject is a special type of Observable that allows values to be
 * multicasted to many Observers. Subjects are like EventEmitters.
 *
 * Every Subject is an Observable and an Observer. You can subscribe to a
 * Subject, and you can call next to feed values as well as error and complete.
 */
class Subject extends Observable_1.Observable {
    constructor() {
        // NOTE: This must be here to obscure Observable's constructor.
        super();
        this.closed = false;
        this.currentObservers = null;
        /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
        this.observers = [];
        /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
        this.isStopped = false;
        /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
        this.hasError = false;
        /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
        this.thrownError = null;
    }
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    lift(operator) {
        const subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    }
    /** @internal */
    _throwIfClosed() {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
    }
    next(value) {
        (0, errorContext_1.errorContext)(() => {
            this._throwIfClosed();
            if (!this.isStopped) {
                if (!this.currentObservers) {
                    this.currentObservers = Array.from(this.observers);
                }
                for (const observer of this.currentObservers) {
                    observer.next(value);
                }
            }
        });
    }
    error(err) {
        (0, errorContext_1.errorContext)(() => {
            this._throwIfClosed();
            if (!this.isStopped) {
                this.hasError = this.isStopped = true;
                this.thrownError = err;
                const { observers } = this;
                while (observers.length) {
                    observers.shift().error(err);
                }
            }
        });
    }
    complete() {
        (0, errorContext_1.errorContext)(() => {
            this._throwIfClosed();
            if (!this.isStopped) {
                this.isStopped = true;
                const { observers } = this;
                while (observers.length) {
                    observers.shift().complete();
                }
            }
        });
    }
    unsubscribe() {
        this.isStopped = this.closed = true;
        this.observers = this.currentObservers = null;
    }
    get observed() {
        var _a;
        return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    /** @internal */
    _trySubscribe(subscriber) {
        this._throwIfClosed();
        return super._trySubscribe(subscriber);
    }
    /** @internal */
    _subscribe(subscriber) {
        this._throwIfClosed();
        this._checkFinalizedStatuses(subscriber);
        return this._innerSubscribe(subscriber);
    }
    /** @internal */
    _innerSubscribe(subscriber) {
        const { hasError, isStopped, observers } = this;
        if (hasError || isStopped) {
            return Subscription_1.EMPTY_SUBSCRIPTION;
        }
        this.currentObservers = null;
        observers.push(subscriber);
        return new Subscription_1.Subscription(() => {
            this.currentObservers = null;
            (0, arrRemove_1.arrRemove)(observers, subscriber);
        });
    }
    /** @internal */
    _checkFinalizedStatuses(subscriber) {
        const { hasError, thrownError, isStopped } = this;
        if (hasError) {
            subscriber.error(thrownError);
        }
        else if (isStopped) {
            subscriber.complete();
        }
    }
    /**
     * Creates a new Observable with this Subject as the source. You can do this
     * to create custom Observer-side logic of the Subject and conceal it from
     * code that uses the Observable.
     * @return {Observable} Observable that the Subject casts to
     */
    asObservable() {
        const observable = new Observable_1.Observable();
        observable.source = this;
        return observable;
    }
}
exports.Subject = Subject;
/**
 * Creates a "subject" by basically gluing an observer to an observable.
 *
 * @nocollapse
 * @deprecated Recommended you do not use. Will be removed at some point in the future. Plans for replacement still under discussion.
 */
Subject.create = (destination, source) => {
    return new AnonymousSubject(destination, source);
};
/**
 * @class AnonymousSubject<T>
 */
class AnonymousSubject extends Subject {
    constructor(
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    destination, source) {
        super();
        this.destination = destination;
        this.source = source;
    }
    next(value) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    }
    error(err) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    }
    complete() {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    /** @internal */
    _subscribe(subscriber) {
        var _a, _b;
        return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : Subscription_1.EMPTY_SUBSCRIPTION;
    }
}
exports.AnonymousSubject = AnonymousSubject;
