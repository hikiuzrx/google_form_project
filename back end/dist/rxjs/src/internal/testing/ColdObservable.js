"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColdObservable = void 0;
const Observable_1 = require("../Observable");
const Subscription_1 = require("../Subscription");
const SubscriptionLoggable_1 = require("./SubscriptionLoggable");
const applyMixins_1 = require("../util/applyMixins");
const Notification_1 = require("../Notification");
class ColdObservable extends Observable_1.Observable {
    constructor(messages, scheduler) {
        super(function (subscriber) {
            const observable = this;
            const index = observable.logSubscribedFrame();
            const subscription = new Subscription_1.Subscription();
            subscription.add(new Subscription_1.Subscription(() => {
                observable.logUnsubscribedFrame(index);
            }));
            observable.scheduleMessages(subscriber);
            return subscription;
        });
        this.messages = messages;
        this.subscriptions = [];
        this.scheduler = scheduler;
    }
    scheduleMessages(subscriber) {
        const messagesLength = this.messages.length;
        for (let i = 0; i < messagesLength; i++) {
            const message = this.messages[i];
            subscriber.add(this.scheduler.schedule((state) => {
                const { message: { notification }, subscriber: destination } = state;
                (0, Notification_1.observeNotification)(notification, destination);
            }, message.frame, { message, subscriber }));
        }
    }
}
exports.ColdObservable = ColdObservable;
(0, applyMixins_1.applyMixins)(ColdObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
