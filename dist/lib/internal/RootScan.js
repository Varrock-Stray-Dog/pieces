"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootData = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
let data = null;
function getRootData() {
    if (data !== null)
        return data;
    const cwd = process.cwd();
    try {
        const file = JSON.parse(fs_1.readFileSync(path_1.join(cwd, 'package.json'), 'utf8'));
        data = { root: path_1.dirname(path_1.join(cwd, file.main)), type: file.type === 'module' ? 'ESM' : 'CommonJS' };
    }
    catch {
        data = { root: cwd, type: 'CommonJS' };
    }
    return data;
}
exports.getRootData = getRootData;
//# sourceMappingURL=RootScan.js.map