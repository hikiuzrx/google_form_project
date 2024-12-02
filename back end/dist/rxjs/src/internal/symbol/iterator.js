"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterator = void 0;
exports.getSymbolIterator = getSymbolIterator;
function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
exports.iterator = getSymbolIterator();
