"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionLog = void 0;
class SubscriptionLog {
    constructor(subscribedFrame, unsubscribedFrame = Infinity) {
        this.subscribedFrame = subscribedFrame;
        this.unsubscribedFrame = unsubscribedFrame;
    }
}
exports.SubscriptionLog = SubscriptionLog;
