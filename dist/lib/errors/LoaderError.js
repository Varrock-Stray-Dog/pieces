"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderError = exports.LoaderErrorType = void 0;
var LoaderErrorType;
(function (LoaderErrorType) {
    LoaderErrorType["EmptyModule"] = "EMPTY_MODULE";
    LoaderErrorType["UnloadedPiece"] = "UNLOADED_PIECE";
    LoaderErrorType["IncorrectType"] = "INCORRECT_TYPE";
})(LoaderErrorType = exports.LoaderErrorType || (exports.LoaderErrorType = {}));
/**
 * Describes a loader error with a type for easy indentification.
 */
class LoaderError extends Error {
    constructor(type, message) {
        super(message);
        this.type = type;
    }
}
exports.LoaderError = LoaderError;
//# sourceMappingURL=LoaderError.js.map