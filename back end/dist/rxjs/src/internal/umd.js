"use strict";
/*
  NOTE: This is the global export file for rxjs v6 and higher.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = exports.webSocket = exports.ajax = exports.testing = exports.operators = void 0;
/* rxjs */
__exportStar(require("../index"), exports);
/* rxjs.operators */
const _operators = __importStar(require("../operators/index"));
exports.operators = _operators;
/* rxjs.testing */
const _testing = __importStar(require("../testing/index"));
exports.testing = _testing;
/* rxjs.ajax */
const _ajax = __importStar(require("../ajax/index"));
exports.ajax = _ajax;
/* rxjs.webSocket */
const _webSocket = __importStar(require("../webSocket/index"));
exports.webSocket = _webSocket;
/* rxjs.fetch */
const _fetch = __importStar(require("../fetch/index"));
exports.fetch = _fetch;
