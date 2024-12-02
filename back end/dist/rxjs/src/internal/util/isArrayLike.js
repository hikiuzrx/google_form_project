"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayLike = void 0;
exports.isArrayLike = ((x) => x && typeof x.length === 'number' && typeof x !== 'function');
