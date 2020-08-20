"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderError = void 0;
class LoaderError extends Error {
    constructor(type, message) {
        super(message);
        this.type = type;
    }
}
exports.LoaderError = LoaderError;
//# sourceMappingURL=LoaderError.js.map