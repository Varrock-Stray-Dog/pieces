"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliasStore = void 0;
const collection_1 = require("@discordjs/collection");
const Store_1 = require("./Store");
class AliasStore extends Store_1.Store {
    constructor() {
        super(...arguments);
        this.aliases = new collection_1.default();
    }
    unload(name) {
        const piece = this.resolve(name);
        // Unload all aliases for the given piece:
        for (const alias of piece.aliases) {
            // We don't want to delete aliases that were overriden by another piece:
            const aliasPiece = this.aliases.get(alias);
            if (aliasPiece === piece)
                this.aliases.delete(alias);
        }
        return super.unload(piece);
    }
    insert(piece) {
        const previous = this.get(piece.name);
        if (previous)
            this.unload(previous);
        for (const key of piece.aliases) {
            this.aliases.set(key, piece);
        }
        return super.insert(piece);
    }
}
exports.AliasStore = AliasStore;
//# sourceMappingURL=AliasStore.js.map