"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = not;
function not(pred, thisArg) {
    return (value, index) => !pred.call(thisArg, value, index);
}
