"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyError = void 0;
const createErrorClass_1 = require("./createErrorClass");
/**
 * An error thrown when an Observable or a sequence was queried but has no
 * elements.
 *
 * @see {@link first}
 * @see {@link last}
 * @see {@link single}
 * @see {@link firstValueFrom}
 * @see {@link lastValueFrom}
 *
 * @class EmptyError
 */
exports.EmptyError = (0, createErrorClass_1.createErrorClass)((_super) => function EmptyErrorImpl() {
    _super(this);
    this.name = 'EmptyError';
    this.message = 'no elements in sequence';
});
