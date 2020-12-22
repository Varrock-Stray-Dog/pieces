"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderStrategy = void 0;
const path_1 = require("path");
const url_1 = require("url");
const MissingExportsError_1 = require("../errors/MissingExportsError");
const import_1 = require("../internal/import");
const Shared_1 = require("./Shared");
/**
 * A multi-purpose feature-complete loader strategy supporting multi-piece modules as well as supporting both ECMAScript
 * Modules and CommonJS with reloading support.
 */
class LoaderStrategy {
    constructor() {
        Object.defineProperty(this, "clientESM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: require.main === undefined
        });
        Object.defineProperty(this, "supportedExtensions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ['.js', '.cjs', '.mjs']
        });
    }
    filter(path) {
        // Retrieve the file extension.
        const extension = path_1.extname(path);
        if (!this.supportedExtensions.includes(extension))
            return null;
        // Retrieve the name of the file, return null if empty.
        const name = path_1.basename(path, extension);
        if (name === '')
            return null;
        // Return the name and extension.
        return { extension, path: name };
    }
    async preload(file) {
        const mjs = file.extension === '.mjs' || (file.extension === '.js' && this.clientESM);
        if (mjs) {
            const url = new url_1.URL(file.path, 'file:');
            url.searchParams.append('d', Date.now().toString());
            return import_1.mjsImport(url);
        }
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(file.path);
        delete require.cache[require.resolve(file.path)];
        return mod;
    }
    async *load(store, file) {
        let yielded = false;
        const result = await this.preload(file);
        // Support `module.exports`:
        if (Shared_1.isClass(result) && Shared_1.classExtends(result, store.Constructor)) {
            yield result;
            yielded = true;
        }
        // Support any other export:
        for (const value of Object.values(result)) {
            if (Shared_1.isClass(value) && Shared_1.classExtends(value, store.Constructor)) {
                yield value;
                yielded = true;
            }
        }
        if (!yielded) {
            throw new MissingExportsError_1.MissingExportsError(file.path);
        }
    }
    onPostLoad() {
        return undefined;
    }
    onUnload() {
        return undefined;
    }
    onError(error, path) {
        console.error(`Error when loading '${path}':`, error);
    }
}
exports.LoaderStrategy = LoaderStrategy;
//# sourceMappingURL=LoaderStrategy.js.map