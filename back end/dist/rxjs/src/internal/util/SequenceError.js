"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceError = void 0;
const createErrorClass_1 = require("./createErrorClass");
/**
 * An error thrown when something is wrong with the sequence of
 * values arriving on the observable.
 *
 * @see {@link operators/single}
 *
 * @class SequenceError
 */
exports.SequenceError = (0, createErrorClass_1.createErrorClass)((_super) => function SequenceErrorImpl(message) {
    _super(this);
    this.name = 'SequenceError';
    this.message = message;
});
