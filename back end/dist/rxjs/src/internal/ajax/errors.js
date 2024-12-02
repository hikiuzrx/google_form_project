"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AjaxTimeoutError = exports.AjaxError = void 0;
const getXHRResponse_1 = require("./getXHRResponse");
const createErrorClass_1 = require("../util/createErrorClass");
/**
 * Thrown when an error occurs during an AJAX request.
 * This is only exported because it is useful for checking to see if an error
 * is an `instanceof AjaxError`. DO NOT create new instances of `AjaxError` with
 * the constructor.
 *
 * @class AjaxError
 * @see {@link ajax}
 */
exports.AjaxError = (0, createErrorClass_1.createErrorClass)((_super) => function AjaxErrorImpl(message, xhr, request) {
    this.message = message;
    this.name = 'AjaxError';
    this.xhr = xhr;
    this.request = request;
    this.status = xhr.status;
    this.responseType = xhr.responseType;
    let response;
    try {
        // This can throw in IE, because we have to do a JSON.parse of
        // the response in some cases to get the expected response property.
        response = (0, getXHRResponse_1.getXHRResponse)(xhr);
    }
    catch (err) {
        response = xhr.responseText;
    }
    this.response = response;
});
/**
 * Thrown when an AJAX request times out. Not to be confused with {@link TimeoutError}.
 *
 * This is exported only because it is useful for checking to see if errors are an
 * `instanceof AjaxTimeoutError`. DO NOT use the constructor to create an instance of
 * this type.
 *
 * @class AjaxTimeoutError
 * @see {@link ajax}
 */
exports.AjaxTimeoutError = (() => {
    function AjaxTimeoutErrorImpl(xhr, request) {
        exports.AjaxError.call(this, 'ajax timeout', xhr, request);
        this.name = 'AjaxTimeoutError';
        return this;
    }
    AjaxTimeoutErrorImpl.prototype = Object.create(exports.AjaxError.prototype);
    return AjaxTimeoutErrorImpl;
})();
