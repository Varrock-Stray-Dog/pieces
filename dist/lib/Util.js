"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getName = void 0;
const path_1 = require("path");
function getName(path) {
    const extension = path_1.extname(path);
    return path_1.basename(path, extension);
}
exports.getName = getName;
//# sourceMappingURL=Util.js.map