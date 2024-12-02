"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observable = void 0;
/**
 * Symbol.observable or a string "@@observable". Used for interop
 *
 * @deprecated We will no longer be exporting this symbol in upcoming versions of RxJS.
 * Instead polyfill and use Symbol.observable directly *or* use https://www.npmjs.com/package/symbol-observable
 */
exports.observable = (() => (typeof Symbol === 'function' && Symbol.observable) || '@@observable')();
