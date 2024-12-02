"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorContext = errorContext;
exports.captureError = captureError;
const config_1 = require("../config");
let context = null;
/**
 * Handles dealing with errors for super-gross mode. Creates a context, in which
 * any synchronously thrown errors will be passed to {@link captureError}. Which
 * will record the error such that it will be rethrown after the call back is complete.
 * TODO: Remove in v8
 * @param cb An immediately executed function.
 */
function errorContext(cb) {
    if (config_1.config.useDeprecatedSynchronousErrorHandling) {
        const isRoot = !context;
        if (isRoot) {
            context = { errorThrown: false, error: null };
        }
        cb();
        if (isRoot) {
            const { errorThrown, error } = context;
            context = null;
            if (errorThrown) {
                throw error;
            }
        }
    }
    else {
        // This is the general non-deprecated path for everyone that
        // isn't crazy enough to use super-gross mode (useDeprecatedSynchronousErrorHandling)
        cb();
    }
}
/**
 * Captures errors only in super-gross mode.
 * @param err the error to capture
 */
function captureError(err) {
    if (config_1.config.useDeprecatedSynchronousErrorHandling && context) {
        context.errorThrown = true;
        context.error = err;
    }
}
