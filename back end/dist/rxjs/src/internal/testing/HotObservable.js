"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotObservable = void 0;
const Subject_1 = require("../Subject");
const Subscription_1 = require("../Subscription");
const SubscriptionLoggable_1 = require("./SubscriptionLoggable");
const applyMixins_1 = require("../util/applyMixins");
const Notification_1 = require("../Notification");
class HotObservable extends Subject_1.Subject {
    constructor(messages, scheduler) {
        super();
        this.messages = messages;
        this.subscriptions = [];
        this.scheduler = scheduler;
    }
    /** @internal */
    _subscribe(subscriber) {
        const subject = this;
        const index = subject.logSubscribedFrame();
        const subscription = new Subscription_1.Subscription();
        subscription.add(new Subscription_1.Subscription(() => {
            subject.logUnsubscribedFrame(index);
        }));
        subscription.add(super._subscribe(subscriber));
        return subscription;
    }
    setup() {
        const subject = this;
        const messagesLength = subject.messages.length;
        /* tslint:disable:no-var-keyword */
        for (let i = 0; i < messagesLength; i++) {
            (() => {
                const { notification, frame } = subject.messages[i];
                /* tslint:enable */
                subject.scheduler.schedule(() => {
                    (0, Notification_1.observeNotification)(notification, subject);
                }, frame);
            })();
        }
    }
}
exports.HotObservable = HotObservable;
(0, applyMixins_1.applyMixins)(HotObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
