"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPLETE_NOTIFICATION = void 0;
exports.errorNotification = errorNotification;
exports.nextNotification = nextNotification;
exports.createNotification = createNotification;
/**
 * A completion object optimized for memory use and created to be the
 * same "shape" as other notifications in v8.
 * @internal
 */
exports.COMPLETE_NOTIFICATION = (() => createNotification('C', undefined, undefined))();
/**
 * Internal use only. Creates an optimized error notification that is the same "shape"
 * as other notifications.
 * @internal
 */
function errorNotification(error) {
    return createNotification('E', undefined, error);
}
/**
 * Internal use only. Creates an optimized next notification that is the same "shape"
 * as other notifications.
 * @internal
 */
function nextNotification(value) {
    return createNotification('N', value, undefined);
}
/**
 * Ensures that all notifications created internally have the same "shape" in v8.
 *
 * TODO: This is only exported to support a crazy legacy test in `groupBy`.
 * @internal
 */
function createNotification(kind, value, error) {
    return {
        kind,
        value,
        error,
    };
}
