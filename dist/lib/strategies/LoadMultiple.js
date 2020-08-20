"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadMultiple = void 0;
const LoaderError_1 = require("../errors/LoaderError");
const Shared_1 = require("./Shared");
exports.LoadMultiple = {
    async *onLoad(store, path) {
        let yielded = false;
        const result = await store.onPreload(path);
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
            throw new LoaderError_1.LoaderError('EMPTY_MODULE', 'A compatible class export was not found.');
        }
    }
};
//# sourceMappingURL=LoadMultiple.js.map