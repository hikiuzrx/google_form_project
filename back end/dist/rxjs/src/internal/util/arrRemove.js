"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrRemove = arrRemove;
/**
 * Removes an item from an array, mutating it.
 * @param arr The array to remove the item from
 * @param item The item to remove
 */
function arrRemove(arr, item) {
    if (arr) {
        const index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}
