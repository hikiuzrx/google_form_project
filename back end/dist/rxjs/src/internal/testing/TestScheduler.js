"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestScheduler = void 0;
const Observable_1 = require("../Observable");
const ColdObservable_1 = require("./ColdObservable");
const HotObservable_1 = require("./HotObservable");
const SubscriptionLog_1 = require("./SubscriptionLog");
const VirtualTimeScheduler_1 = require("../scheduler/VirtualTimeScheduler");
const NotificationFactories_1 = require("../NotificationFactories");
const dateTimestampProvider_1 = require("../scheduler/dateTimestampProvider");
const performanceTimestampProvider_1 = require("../scheduler/performanceTimestampProvider");
const animationFrameProvider_1 = require("../scheduler/animationFrameProvider");
const immediateProvider_1 = require("../scheduler/immediateProvider");
const intervalProvider_1 = require("../scheduler/intervalProvider");
const timeoutProvider_1 = require("../scheduler/timeoutProvider");
const defaultMaxFrame = 750;
class TestScheduler extends VirtualTimeScheduler_1.VirtualTimeScheduler {
    /**
     *
     * @param assertDeepEqual A function to set up your assertion for your test harness
     */
    constructor(assertDeepEqual) {
        super(VirtualTimeScheduler_1.VirtualAction, defaultMaxFrame);
        this.assertDeepEqual = assertDeepEqual;
        /**
         * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
         */
        this.hotObservables = [];
        /**
         * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
         */
        this.coldObservables = [];
        /**
         * Test meta data to be processed during `flush()`
         */
        this.flushTests = [];
        /**
         * Indicates whether the TestScheduler instance is operating in "run mode",
         * meaning it's processing a call to `run()`
         */
        this.runMode = false;
    }
    createTime(marbles) {
        const indexOf = this.runMode ? marbles.trim().indexOf('|') : marbles.indexOf('|');
        if (indexOf === -1) {
            throw new Error('marble diagram for time should have a completion marker "|"');
        }
        return indexOf * TestScheduler.frameTimeFactor;
    }
    /**
     * @param marbles A diagram in the marble DSL. Letters map to keys in `values` if provided.
     * @param values Values to use for the letters in `marbles`. If omitted, the letters themselves are used.
     * @param error The error to use for the `#` marble (if present).
     */
    createColdObservable(marbles, values, error) {
        if (marbles.indexOf('^') !== -1) {
            throw new Error('cold observable cannot have subscription offset "^"');
        }
        if (marbles.indexOf('!') !== -1) {
            throw new Error('cold observable cannot have unsubscription marker "!"');
        }
        const messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
        const cold = new ColdObservable_1.ColdObservable(messages, this);
        this.coldObservables.push(cold);
        return cold;
    }
    /**
     * @param marbles A diagram in the marble DSL. Letters map to keys in `values` if provided.
     * @param values Values to use for the letters in `marbles`. If omitted, the letters themselves are used.
     * @param error The error to use for the `#` marble (if present).
     */
    createHotObservable(marbles, values, error) {
        if (marbles.indexOf('!') !== -1) {
            throw new Error('hot observable cannot have unsubscription marker "!"');
        }
        const messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
        const subject = new HotObservable_1.HotObservable(messages, this);
        this.hotObservables.push(subject);
        return subject;
    }
    materializeInnerObservable(observable, outerFrame) {
        const messages = [];
        observable.subscribe({
            next: (value) => {
                messages.push({ frame: this.frame - outerFrame, notification: (0, NotificationFactories_1.nextNotification)(value) });
            },
            error: (error) => {
                messages.push({ frame: this.frame - outerFrame, notification: (0, NotificationFactories_1.errorNotification)(error) });
            },
            complete: () => {
                messages.push({ frame: this.frame - outerFrame, notification: NotificationFactories_1.COMPLETE_NOTIFICATION });
            },
        });
        return messages;
    }
    expectObservable(observable, subscriptionMarbles = null) {
        const actual = [];
        const flushTest = { actual, ready: false };
        const subscriptionParsed = TestScheduler.parseMarblesAsSubscriptions(subscriptionMarbles, this.runMode);
        const subscriptionFrame = subscriptionParsed.subscribedFrame === Infinity ? 0 : subscriptionParsed.subscribedFrame;
        const unsubscriptionFrame = subscriptionParsed.unsubscribedFrame;
        let subscription;
        this.schedule(() => {
            subscription = observable.subscribe({
                next: (x) => {
                    // Support Observable-of-Observables
                    const value = x instanceof Observable_1.Observable ? this.materializeInnerObservable(x, this.frame) : x;
                    actual.push({ frame: this.frame, notification: (0, NotificationFactories_1.nextNotification)(value) });
                },
                error: (error) => {
                    actual.push({ frame: this.frame, notification: (0, NotificationFactories_1.errorNotification)(error) });
                },
                complete: () => {
                    actual.push({ frame: this.frame, notification: NotificationFactories_1.COMPLETE_NOTIFICATION });
                },
            });
        }, subscriptionFrame);
        if (unsubscriptionFrame !== Infinity) {
            this.schedule(() => subscription.unsubscribe(), unsubscriptionFrame);
        }
        this.flushTests.push(flushTest);
        const { runMode } = this;
        return {
            toBe(marbles, values, errorValue) {
                flushTest.ready = true;
                flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true, runMode);
            },
            toEqual: (other) => {
                flushTest.ready = true;
                flushTest.expected = [];
                this.schedule(() => {
                    subscription = other.subscribe({
                        next: (x) => {
                            // Support Observable-of-Observables
                            const value = x instanceof Observable_1.Observable ? this.materializeInnerObservable(x, this.frame) : x;
                            flushTest.expected.push({ frame: this.frame, notification: (0, NotificationFactories_1.nextNotification)(value) });
                        },
                        error: (error) => {
                            flushTest.expected.push({ frame: this.frame, notification: (0, NotificationFactories_1.errorNotification)(error) });
                        },
                        complete: () => {
                            flushTest.expected.push({ frame: this.frame, notification: NotificationFactories_1.COMPLETE_NOTIFICATION });
                        },
                    });
                }, subscriptionFrame);
            },
        };
    }
    expectSubscriptions(actualSubscriptionLogs) {
        const flushTest = { actual: actualSubscriptionLogs, ready: false };
        this.flushTests.push(flushTest);
        const { runMode } = this;
        return {
            toBe(marblesOrMarblesArray) {
                const marblesArray = typeof marblesOrMarblesArray === 'string' ? [marblesOrMarblesArray] : marblesOrMarblesArray;
                flushTest.ready = true;
                flushTest.expected = marblesArray
                    .map((marbles) => TestScheduler.parseMarblesAsSubscriptions(marbles, runMode))
                    .filter((marbles) => marbles.subscribedFrame !== Infinity);
            },
        };
    }
    flush() {
        const hotObservables = this.hotObservables;
        while (hotObservables.length > 0) {
            hotObservables.shift().setup();
        }
        super.flush();
        this.flushTests = this.flushTests.filter((test) => {
            if (test.ready) {
                this.assertDeepEqual(test.actual, test.expected);
                return false;
            }
            return true;
        });
    }
    /** @nocollapse */
    static parseMarblesAsSubscriptions(marbles, runMode = false) {
        if (typeof marbles !== 'string') {
            return new SubscriptionLog_1.SubscriptionLog(Infinity);
        }
        // Spreading the marbles into an array leverages ES2015's support for emoji
        // characters when iterating strings.
        const characters = [...marbles];
        const len = characters.length;
        let groupStart = -1;
        let subscriptionFrame = Infinity;
        let unsubscriptionFrame = Infinity;
        let frame = 0;
        for (let i = 0; i < len; i++) {
            let nextFrame = frame;
            const advanceFrameBy = (count) => {
                nextFrame += count * this.frameTimeFactor;
            };
            const c = characters[i];
            switch (c) {
                case ' ':
                    // Whitespace no longer advances time
                    if (!runMode) {
                        advanceFrameBy(1);
                    }
                    break;
                case '-':
                    advanceFrameBy(1);
                    break;
                case '(':
                    groupStart = frame;
                    advanceFrameBy(1);
                    break;
                case ')':
                    groupStart = -1;
                    advanceFrameBy(1);
                    break;
                case '^':
                    if (subscriptionFrame !== Infinity) {
                        throw new Error("found a second subscription point '^' in a " + 'subscription marble diagram. There can only be one.');
                    }
                    subscriptionFrame = groupStart > -1 ? groupStart : frame;
                    advanceFrameBy(1);
                    break;
                case '!':
                    if (unsubscriptionFrame !== Infinity) {
                        throw new Error("found a second unsubscription point '!' in a " + 'subscription marble diagram. There can only be one.');
                    }
                    unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
                    break;
                default:
                    // time progression syntax
                    if (runMode && c.match(/^[0-9]$/)) {
                        // Time progression must be preceded by at least one space
                        // if it's not at the beginning of the diagram
                        if (i === 0 || characters[i - 1] === ' ') {
                            const buffer = characters.slice(i).join('');
                            const match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                            if (match) {
                                i += match[0].length - 1;
                                const duration = parseFloat(match[1]);
                                const unit = match[2];
                                let durationInMs;
                                switch (unit) {
                                    case 'ms':
                                        durationInMs = duration;
                                        break;
                                    case 's':
                                        durationInMs = duration * 1000;
                                        break;
                                    case 'm':
                                        durationInMs = duration * 1000 * 60;
                                        break;
                                    default:
                                        break;
                                }
                                advanceFrameBy(durationInMs / this.frameTimeFactor);
                                break;
                            }
                        }
                    }
                    throw new Error("there can only be '^' and '!' markers in a " + "subscription marble diagram. Found instead '" + c + "'.");
            }
            frame = nextFrame;
        }
        if (unsubscriptionFrame < 0) {
            return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame);
        }
        else {
            return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
        }
    }
    /** @nocollapse */
    static parseMarbles(marbles, values, errorValue, materializeInnerObservables = false, runMode = false) {
        if (marbles.indexOf('!') !== -1) {
            throw new Error('conventional marble diagrams cannot have the ' + 'unsubscription marker "!"');
        }
        // Spreading the marbles into an array leverages ES2015's support for emoji
        // characters when iterating strings.
        const characters = [...marbles];
        const len = characters.length;
        const testMessages = [];
        const subIndex = runMode ? marbles.replace(/^[ ]+/, '').indexOf('^') : marbles.indexOf('^');
        let frame = subIndex === -1 ? 0 : subIndex * -this.frameTimeFactor;
        const getValue = typeof values !== 'object'
            ? (x) => x
            : (x) => {
                // Support Observable-of-Observables
                if (materializeInnerObservables && values[x] instanceof ColdObservable_1.ColdObservable) {
                    return values[x].messages;
                }
                return values[x];
            };
        let groupStart = -1;
        for (let i = 0; i < len; i++) {
            let nextFrame = frame;
            const advanceFrameBy = (count) => {
                nextFrame += count * this.frameTimeFactor;
            };
            let notification;
            const c = characters[i];
            switch (c) {
                case ' ':
                    // Whitespace no longer advances time
                    if (!runMode) {
                        advanceFrameBy(1);
                    }
                    break;
                case '-':
                    advanceFrameBy(1);
                    break;
                case '(':
                    groupStart = frame;
                    advanceFrameBy(1);
                    break;
                case ')':
                    groupStart = -1;
                    advanceFrameBy(1);
                    break;
                case '|':
                    notification = NotificationFactories_1.COMPLETE_NOTIFICATION;
                    advanceFrameBy(1);
                    break;
                case '^':
                    advanceFrameBy(1);
                    break;
                case '#':
                    notification = (0, NotificationFactories_1.errorNotification)(errorValue || 'error');
                    advanceFrameBy(1);
                    break;
                default:
                    // Might be time progression syntax, or a value literal
                    if (runMode && c.match(/^[0-9]$/)) {
                        // Time progression must be preceded by at least one space
                        // if it's not at the beginning of the diagram
                        if (i === 0 || characters[i - 1] === ' ') {
                            const buffer = characters.slice(i).join('');
                            const match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                            if (match) {
                                i += match[0].length - 1;
                                const duration = parseFloat(match[1]);
                                const unit = match[2];
                                let durationInMs;
                                switch (unit) {
                                    case 'ms':
                                        durationInMs = duration;
                                        break;
                                    case 's':
                                        durationInMs = duration * 1000;
                                        break;
                                    case 'm':
                                        durationInMs = duration * 1000 * 60;
                                        break;
                                    default:
                                        break;
                                }
                                advanceFrameBy(durationInMs / this.frameTimeFactor);
                                break;
                            }
                        }
                    }
                    notification = (0, NotificationFactories_1.nextNotification)(getValue(c));
                    advanceFrameBy(1);
                    break;
            }
            if (notification) {
                testMessages.push({ frame: groupStart > -1 ? groupStart : frame, notification });
            }
            frame = nextFrame;
        }
        return testMessages;
    }
    createAnimator() {
        if (!this.runMode) {
            throw new Error('animate() must only be used in run mode');
        }
        // The TestScheduler assigns a delegate to the provider that's used for
        // requestAnimationFrame (rAF). The delegate works in conjunction with the
        // animate run helper to coordinate the invocation of any rAF callbacks,
        // that are effected within tests, with the animation frames specified by
        // the test's author - in the marbles that are passed to the animate run
        // helper. This allows the test's author to write deterministic tests and
        // gives the author full control over when - or if - animation frames are
        // 'painted'.
        let lastHandle = 0;
        let map;
        const delegate = {
            requestAnimationFrame(callback) {
                if (!map) {
                    throw new Error('animate() was not called within run()');
                }
                const handle = ++lastHandle;
                map.set(handle, callback);
                return handle;
            },
            cancelAnimationFrame(handle) {
                if (!map) {
                    throw new Error('animate() was not called within run()');
                }
                map.delete(handle);
            },
        };
        const animate = (marbles) => {
            if (map) {
                throw new Error('animate() must not be called more than once within run()');
            }
            if (/[|#]/.test(marbles)) {
                throw new Error('animate() must not complete or error');
            }
            map = new Map();
            const messages = TestScheduler.parseMarbles(marbles, undefined, undefined, undefined, true);
            for (const message of messages) {
                this.schedule(() => {
                    const now = this.now();
                    // Capture the callbacks within the queue and clear the queue
                    // before enumerating the callbacks, as callbacks might
                    // reschedule themselves. (And, yeah, we're using a Map to represent
                    // the queue, but the values are guaranteed to be returned in
                    // insertion order, so it's all good. Trust me, I've read the docs.)
                    const callbacks = Array.from(map.values());
                    map.clear();
                    for (const callback of callbacks) {
                        callback(now);
                    }
                }, message.frame);
            }
        };
        return { animate, delegate };
    }
    createDelegates() {
        // When in run mode, the TestScheduler provides alternate implementations
        // of set/clearImmediate and set/clearInterval. These implementations are
        // consumed by the scheduler implementations via the providers. This is
        // done to effect deterministic asap and async scheduler behavior so that
        // all of the schedulers are testable in 'run mode'. Prior to v7,
        // delegation occurred at the scheduler level. That is, the asap and
        // animation frame schedulers were identical in behavior to the async
        // scheduler. Now, when in run mode, asap actions are prioritized over
        // async actions and animation frame actions are coordinated using the
        // animate run helper.
        let lastHandle = 0;
        const scheduleLookup = new Map();
        const run = () => {
            // Whenever a scheduled run is executed, it must run a single immediate
            // or interval action - with immediate actions being prioritized over
            // interval and timeout actions.
            const now = this.now();
            const scheduledRecords = Array.from(scheduleLookup.values());
            const scheduledRecordsDue = scheduledRecords.filter(({ due }) => due <= now);
            const dueImmediates = scheduledRecordsDue.filter(({ type }) => type === 'immediate');
            if (dueImmediates.length > 0) {
                const { handle, handler } = dueImmediates[0];
                scheduleLookup.delete(handle);
                handler();
                return;
            }
            const dueIntervals = scheduledRecordsDue.filter(({ type }) => type === 'interval');
            if (dueIntervals.length > 0) {
                const firstDueInterval = dueIntervals[0];
                const { duration, handler } = firstDueInterval;
                firstDueInterval.due = now + duration;
                // The interval delegate must behave like setInterval, so run needs to
                // be rescheduled. This will continue until the clearInterval delegate
                // unsubscribes and deletes the handle from the map.
                firstDueInterval.subscription = this.schedule(run, duration);
                handler();
                return;
            }
            const dueTimeouts = scheduledRecordsDue.filter(({ type }) => type === 'timeout');
            if (dueTimeouts.length > 0) {
                const { handle, handler } = dueTimeouts[0];
                scheduleLookup.delete(handle);
                handler();
                return;
            }
            throw new Error('Expected a due immediate or interval');
        };
        // The following objects are the delegates that replace conventional
        // runtime implementations with TestScheduler implementations.
        //
        // The immediate delegate is depended upon by the asapScheduler.
        //
        // The interval delegate is depended upon by the asyncScheduler.
        //
        // The timeout delegate is not depended upon by any scheduler, but it's
        // included here because the onUnhandledError and onStoppedNotification
        // configuration points use setTimeout to avoid producer interference. It's
        // inclusion allows for the testing of these configuration points.
        const immediate = {
            setImmediate: (handler) => {
                const handle = ++lastHandle;
                scheduleLookup.set(handle, {
                    due: this.now(),
                    duration: 0,
                    handle,
                    handler,
                    subscription: this.schedule(run, 0),
                    type: 'immediate',
                });
                return handle;
            },
            clearImmediate: (handle) => {
                const value = scheduleLookup.get(handle);
                if (value) {
                    value.subscription.unsubscribe();
                    scheduleLookup.delete(handle);
                }
            },
        };
        const interval = {
            setInterval: (handler, duration = 0) => {
                const handle = ++lastHandle;
                scheduleLookup.set(handle, {
                    due: this.now() + duration,
                    duration,
                    handle,
                    handler,
                    subscription: this.schedule(run, duration),
                    type: 'interval',
                });
                return handle;
            },
            clearInterval: (handle) => {
                const value = scheduleLookup.get(handle);
                if (value) {
                    value.subscription.unsubscribe();
                    scheduleLookup.delete(handle);
                }
            },
        };
        const timeout = {
            setTimeout: (handler, duration = 0) => {
                const handle = ++lastHandle;
                scheduleLookup.set(handle, {
                    due: this.now() + duration,
                    duration,
                    handle,
                    handler,
                    subscription: this.schedule(run, duration),
                    type: 'timeout',
                });
                return handle;
            },
            clearTimeout: (handle) => {
                const value = scheduleLookup.get(handle);
                if (value) {
                    value.subscription.unsubscribe();
                    scheduleLookup.delete(handle);
                }
            },
        };
        return { immediate, interval, timeout };
    }
    /**
     * The `run` method performs the test in 'run mode' - in which schedulers
     * used within the test automatically delegate to the `TestScheduler`. That
     * is, in 'run mode' there is no need to explicitly pass a `TestScheduler`
     * instance to observable creators or operators.
     *
     * @see {@link /guide/testing/marble-testing}
     */
    run(callback) {
        const prevFrameTimeFactor = TestScheduler.frameTimeFactor;
        const prevMaxFrames = this.maxFrames;
        TestScheduler.frameTimeFactor = 1;
        this.maxFrames = Infinity;
        this.runMode = true;
        const animator = this.createAnimator();
        const delegates = this.createDelegates();
        animationFrameProvider_1.animationFrameProvider.delegate = animator.delegate;
        dateTimestampProvider_1.dateTimestampProvider.delegate = this;
        immediateProvider_1.immediateProvider.delegate = delegates.immediate;
        intervalProvider_1.intervalProvider.delegate = delegates.interval;
        timeoutProvider_1.timeoutProvider.delegate = delegates.timeout;
        performanceTimestampProvider_1.performanceTimestampProvider.delegate = this;
        const helpers = {
            cold: this.createColdObservable.bind(this),
            hot: this.createHotObservable.bind(this),
            flush: this.flush.bind(this),
            time: this.createTime.bind(this),
            expectObservable: this.expectObservable.bind(this),
            expectSubscriptions: this.expectSubscriptions.bind(this),
            animate: animator.animate,
        };
        try {
            const ret = callback(helpers);
            this.flush();
            return ret;
        }
        finally {
            TestScheduler.frameTimeFactor = prevFrameTimeFactor;
            this.maxFrames = prevMaxFrames;
            this.runMode = false;
            animationFrameProvider_1.animationFrameProvider.delegate = undefined;
            dateTimestampProvider_1.dateTimestampProvider.delegate = undefined;
            immediateProvider_1.immediateProvider.delegate = undefined;
            intervalProvider_1.intervalProvider.delegate = undefined;
            timeoutProvider_1.timeoutProvider.delegate = undefined;
            performanceTimestampProvider_1.performanceTimestampProvider.delegate = undefined;
        }
    }
}
exports.TestScheduler = TestScheduler;
/**
 * The number of virtual time units each character in a marble diagram represents. If
 * the test scheduler is being used in "run mode", via the `run` method, this is temporarily
 * set to `1` for the duration of the `run` block, then set back to whatever value it was.
 * @nocollapse
 */
TestScheduler.frameTimeFactor = 10;
