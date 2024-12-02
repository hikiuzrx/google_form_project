"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObject = createObject;
function createObject(keys, values) {
    return keys.reduce((result, key, i) => ((result[key] = values[i]), result), {});
}
