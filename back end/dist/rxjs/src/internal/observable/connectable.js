"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectable = connectable;
const Subject_1 = require("../Subject");
const Observable_1 = require("../Observable");
const defer_1 = require("./defer");
/**
 * The default configuration for `connectable`.
 */
const DEFAULT_CONFIG = {
    connector: () => new Subject_1.Subject(),
    resetOnDisconnect: true,
};
/**
 * Creates an observable that multicasts once `connect()` is called on it.
 *
 * @param source The observable source to make connectable.
 * @param config The configuration object for `connectable`.
 * @returns A "connectable" observable, that has a `connect()` method, that you must call to
 * connect the source to all consumers through the subject provided as the connector.
 */
function connectable(source, config = DEFAULT_CONFIG) {
    // The subscription representing the connection.
    let connection = null;
    const { connector, resetOnDisconnect = true } = config;
    let subject = connector();
    const result = new Observable_1.Observable((subscriber) => {
        return subject.subscribe(subscriber);
    });
    // Define the `connect` function. This is what users must call
    // in order to "connect" the source to the subject that is
    // multicasting it.
    result.connect = () => {
        if (!connection || connection.closed) {
            connection = (0, defer_1.defer)(() => source).subscribe(subject);
            if (resetOnDisconnect) {
                connection.add(() => (subject = connector()));
            }
        }
        return connection;
    };
    return result;
}
