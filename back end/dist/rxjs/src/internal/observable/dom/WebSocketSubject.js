"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketSubject = void 0;
const Subject_1 = require("../../Subject");
const Subscriber_1 = require("../../Subscriber");
const Observable_1 = require("../../Observable");
const Subscription_1 = require("../../Subscription");
const ReplaySubject_1 = require("../../ReplaySubject");
const DEFAULT_WEBSOCKET_CONFIG = {
    url: '',
    deserializer: (e) => JSON.parse(e.data),
    serializer: (value) => JSON.stringify(value),
};
const WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT = 'WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }';
class WebSocketSubject extends Subject_1.AnonymousSubject {
    constructor(urlConfigOrSource, destination) {
        super();
        this._socket = null;
        if (urlConfigOrSource instanceof Observable_1.Observable) {
            this.destination = destination;
            this.source = urlConfigOrSource;
        }
        else {
            const config = (this._config = Object.assign({}, DEFAULT_WEBSOCKET_CONFIG));
            this._output = new Subject_1.Subject();
            if (typeof urlConfigOrSource === 'string') {
                config.url = urlConfigOrSource;
            }
            else {
                for (const key in urlConfigOrSource) {
                    if (urlConfigOrSource.hasOwnProperty(key)) {
                        config[key] = urlConfigOrSource[key];
                    }
                }
            }
            if (!config.WebSocketCtor && WebSocket) {
                config.WebSocketCtor = WebSocket;
            }
            else if (!config.WebSocketCtor) {
                throw new Error('no WebSocket constructor can be found');
            }
            this.destination = new ReplaySubject_1.ReplaySubject();
        }
    }
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    lift(operator) {
        const sock = new WebSocketSubject(this._config, this.destination);
        sock.operator = operator;
        sock.source = this;
        return sock;
    }
    _resetState() {
        this._socket = null;
        if (!this.source) {
            this.destination = new ReplaySubject_1.ReplaySubject();
        }
        this._output = new Subject_1.Subject();
    }
    /**
     * Creates an {@link Observable}, that when subscribed to, sends a message,
     * defined by the `subMsg` function, to the server over the socket to begin a
     * subscription to data over that socket. Once data arrives, the
     * `messageFilter` argument will be used to select the appropriate data for
     * the resulting Observable. When finalization occurs, either due to
     * unsubscription, completion, or error, a message defined by the `unsubMsg`
     * argument will be sent to the server over the WebSocketSubject.
     *
     * @param subMsg A function to generate the subscription message to be sent to
     * the server. This will still be processed by the serializer in the
     * WebSocketSubject's config. (Which defaults to JSON serialization)
     * @param unsubMsg A function to generate the unsubscription message to be
     * sent to the server at finalization. This will still be processed by the
     * serializer in the WebSocketSubject's config.
     * @param messageFilter A predicate for selecting the appropriate messages
     * from the server for the output stream.
     */
    multiplex(subMsg, unsubMsg, messageFilter) {
        const self = this;
        return new Observable_1.Observable((observer) => {
            try {
                self.next(subMsg());
            }
            catch (err) {
                observer.error(err);
            }
            const subscription = self.subscribe({
                next: (x) => {
                    try {
                        if (messageFilter(x)) {
                            observer.next(x);
                        }
                    }
                    catch (err) {
                        observer.error(err);
                    }
                },
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
            });
            return () => {
                try {
                    self.next(unsubMsg());
                }
                catch (err) {
                    observer.error(err);
                }
                subscription.unsubscribe();
            };
        });
    }
    _connectSocket() {
        const { WebSocketCtor, protocol, url, binaryType } = this._config;
        const observer = this._output;
        let socket = null;
        try {
            socket = protocol ? new WebSocketCtor(url, protocol) : new WebSocketCtor(url);
            this._socket = socket;
            if (binaryType) {
                this._socket.binaryType = binaryType;
            }
        }
        catch (e) {
            observer.error(e);
            return;
        }
        const subscription = new Subscription_1.Subscription(() => {
            this._socket = null;
            if (socket && socket.readyState === 1) {
                socket.close();
            }
        });
        socket.onopen = (evt) => {
            const { _socket } = this;
            if (!_socket) {
                socket.close();
                this._resetState();
                return;
            }
            const { openObserver } = this._config;
            if (openObserver) {
                openObserver.next(evt);
            }
            const queue = this.destination;
            this.destination = Subscriber_1.Subscriber.create((x) => {
                if (socket.readyState === 1) {
                    try {
                        const { serializer } = this._config;
                        socket.send(serializer(x));
                    }
                    catch (e) {
                        this.destination.error(e);
                    }
                }
            }, (err) => {
                const { closingObserver } = this._config;
                if (closingObserver) {
                    closingObserver.next(undefined);
                }
                if (err && err.code) {
                    socket.close(err.code, err.reason);
                }
                else {
                    observer.error(new TypeError(WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT));
                }
                this._resetState();
            }, () => {
                const { closingObserver } = this._config;
                if (closingObserver) {
                    closingObserver.next(undefined);
                }
                socket.close();
                this._resetState();
            });
            if (queue && queue instanceof ReplaySubject_1.ReplaySubject) {
                subscription.add(queue.subscribe(this.destination));
            }
        };
        socket.onerror = (e) => {
            this._resetState();
            observer.error(e);
        };
        socket.onclose = (e) => {
            if (socket === this._socket) {
                this._resetState();
            }
            const { closeObserver } = this._config;
            if (closeObserver) {
                closeObserver.next(e);
            }
            if (e.wasClean) {
                observer.complete();
            }
            else {
                observer.error(e);
            }
        };
        socket.onmessage = (e) => {
            try {
                const { deserializer } = this._config;
                observer.next(deserializer(e));
            }
            catch (err) {
                observer.error(err);
            }
        };
    }
    /** @internal */
    _subscribe(subscriber) {
        const { source } = this;
        if (source) {
            return source.subscribe(subscriber);
        }
        if (!this._socket) {
            this._connectSocket();
        }
        this._output.subscribe(subscriber);
        subscriber.add(() => {
            const { _socket } = this;
            if (this._output.observers.length === 0) {
                if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
                    _socket.close();
                }
                this._resetState();
            }
        });
        return subscriber;
    }
    unsubscribe() {
        const { _socket } = this;
        if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
            _socket.close();
        }
        this._resetState();
        super.unsubscribe();
    }
}
exports.WebSocketSubject = WebSocketSubject;
