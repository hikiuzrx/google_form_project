"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const borderedText = (text) => {
    const lines = text.split('\n');
    const width = Math.max(...lines.map((l) => l.length));
    const res = [`┌${'─'.repeat(width + 2)}┐`];
    for (const line of lines) {
        res.push(`│ ${line.padEnd(width)} │`);
    }
    res.push(`└${'─'.repeat(width + 2)}┘`);
    return res.join('\n');
};
exports.default = borderedText;
