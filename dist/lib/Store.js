"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const collection_1 = require("@discordjs/collection");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const LoaderError_1 = require("./errors/LoaderError");
const LoadSingle_1 = require("./strategies/LoadSingle");
const Util_1 = require("./Util");
class Store extends collection_1.default {
    constructor(constructor, options = {}) {
        var _a, _b, _c, _d, _e, _f;
        super();
        this.Constructor = constructor;
        this.paths = (_a = options.paths) !== null && _a !== void 0 ? _a : [];
        this.context = options.context;
        this.onPreload = (_b = options.onPreload) !== null && _b !== void 0 ? _b : ((path) => Promise.resolve().then(() => require(path)));
        this.onLoad = (_c = options.onLoad) !== null && _c !== void 0 ? _c : LoadSingle_1.LoadSingle.onLoad.bind(LoadSingle_1.LoadSingle);
        this.onPostLoad = (_d = options.onPostLoad) !== null && _d !== void 0 ? _d : (() => void 0);
        this.onUnload = (_e = options.onUnload) !== null && _e !== void 0 ? _e : (() => void 0);
        this.onError = (_f = options.onError) !== null && _f !== void 0 ? _f : ((error) => console.error(error));
    }
    async *load(path) {
        const options = { name: Util_1.getName(path), enabled: true };
        for await (const Ctor of this.onLoad(this, path)) {
            yield this.insert(new Ctor({ context: this.context, path }, options));
        }
    }
    unload(name) {
        const piece = this.resolve(name);
        this.delete(piece.name);
        this.onUnload(this, piece);
        return piece;
    }
    async loadAll() {
        const pieces = [];
        for (const path of this.paths) {
            for await (const piece of this.loadPath(path)) {
                pieces.push(piece);
            }
        }
        this.clear();
        for (const piece of pieces) {
            this.insert(piece);
        }
    }
    resolve(name) {
        if (typeof name === 'string') {
            const result = this.get(name);
            if (typeof result === 'undefined')
                throw new LoaderError_1.LoaderError('UNLOADED_PIECE', `The piece ${name} does not exist.`);
            return result;
        }
        return name;
    }
    insert(piece) {
        this.set(piece.name, piece);
        this.onPostLoad(this, piece);
        return piece;
    }
    async *loadPath(directory) {
        for await (const child of this.walk(directory)) {
            const path = path_1.join(directory, child.name);
            const name = Util_1.getName(path);
            try {
                for await (const Ctor of this.onLoad(this, path)) {
                    yield new Ctor({ context: this.context, path }, { name });
                }
            }
            catch (error) {
                this.onError(error, path);
            }
        }
    }
    async *walk(path) {
        const dir = await promises_1.opendir(path);
        for await (const item of dir) {
            if (item.isFile())
                yield item;
            else if (item.isDirectory())
                yield* this.walk(path_1.join(dir.path, item.name));
        }
    }
}
exports.Store = Store;
//# sourceMappingURL=Store.js.map