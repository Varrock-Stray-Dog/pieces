"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = void 0;
/**
 * The piece to be stored in [[Store]] instances.
 */
class Piece {
    constructor(context, options = {}) {
        var _a, _b;
        this.extras = context.extras;
        this.store = context.store;
        this.path = context.path;
        this.name = (_a = options.name) !== null && _a !== void 0 ? _a : context.name;
        this.enabled = (_b = options.enabled) !== null && _b !== void 0 ? _b : true;
    }
    /**
     * Per-piece listener that is called when the piece is loaded into the store.
     * Useful to set-up asynchronous initialization tasks.
     */
    onLoad() {
        return undefined;
    }
    /**
     * Per-piece listener that is called when the piece is unloaded from the store.
     * Useful to set-up clean-up tasks.
     */
    onUnload() {
        return undefined;
    }
    toJSON() {
        return {
            path: this.path,
            name: this.name,
            enabled: this.enabled
        };
    }
}
exports.Piece = Piece;
//# sourceMappingURL=Piece.js.map