"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const collection_1 = __importDefault(require("@discordjs/collection"));
const fs_1 = require("fs");
const path_1 = require("path");
const LoaderError_1 = require("../errors/LoaderError");
const LoaderStrategy_1 = require("../strategies/LoaderStrategy");
/**
 * The store class which contains [[Piece]]s.
 */
class Store extends collection_1.default {
    /**
     * @param constructor The piece constructor this store loads.
     * @param options The options for the store.
     */
    constructor(constructor, options) {
        var _a, _b;
        super();
        Object.defineProperty(this, "Constructor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "paths", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "strategy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.Constructor = constructor;
        this.name = options.name;
        this.paths = new Set((_a = options.paths) !== null && _a !== void 0 ? _a : []);
        this.strategy = (_b = options.strategy) !== null && _b !== void 0 ? _b : Store.defaultStrategy;
    }
    /**
     * The extras to be used for dependency injection in all pieces. Returns a reference of [[Store.defaultExtras]].
     */
    get context() {
        return Store.injectedContext;
    }
    /**
     * Registers a directory into the store.
     * @param path The path to be added.
     * @example
     * ```typescript
     * store
     *   .registerPath(resolve('commands'))
     *   .registerPath(resolve('third-party', 'commands'));
     * ```
     */
    registerPath(path) {
        var _a;
        this.paths.add(path);
        (_a = Store.logger) === null || _a === void 0 ? void 0 : _a.call(Store, `[STORE => ${this.name}] [REGISTER] Registered path '${path}'.`);
        return this;
    }
    /**
     * Loads one or more pieces from a path.
     * @param path The path of the file to load.
     * @return An async iterator that yields each one of the loaded pieces.
     */
    async load(path) {
        var _a;
        const data = this.strategy.filter(path);
        if (data === null) {
            (_a = Store.logger) === null || _a === void 0 ? void 0 : _a.call(Store, `[STORE => ${this.name}] [LOAD] Skipped piece '${path}' as 'LoaderStrategy#filter' returned 'null'.`);
            return [];
        }
        const promises = [];
        for await (const Ctor of this.strategy.load(this, data)) {
            promises.push(this.insert(this.construct(Ctor, data)));
        }
        return Promise.all(promises);
    }
    /**
     * Unloads a piece given its instance or its name.
     * @param name The name of the file to load.
     * @return Returns the piece that was unloaded.
     */
    async unload(name) {
        var _a, _b;
        const piece = this.resolve(name);
        // Unload piece:
        this.strategy.onUnload(this, piece);
        await piece.onUnload();
        (_a = Store.logger) === null || _a === void 0 ? void 0 : _a.call(Store, `[STORE => ${this.name}] [UNLOAD] Unloaded piece '${piece.name}'.`);
        // Remove from cache and return it:
        this.delete(piece.name);
        (_b = Store.logger) === null || _b === void 0 ? void 0 : _b.call(Store, `[STORE => ${this.name}] [UNLOAD] Removed piece '${piece.name}'.`);
        return piece;
    }
    /**
     * Loads all pieces from all directories specified by [[paths]].
     */
    async loadAll() {
        var _a, _b, _c;
        const pieces = [];
        for (const path of this.paths) {
            for await (const piece of this.loadPath(path)) {
                pieces.push(piece);
            }
        }
        (_a = Store.logger) === null || _a === void 0 ? void 0 : _a.call(Store, `[STORE => ${this.name}] [LOAD-ALL] Found '${pieces.length}' pieces.`);
        // Clear the store before inserting the new pieces:
        this.clear();
        (_b = Store.logger) === null || _b === void 0 ? void 0 : _b.call(Store, `[STORE => ${this.name}] [LOAD-ALL] Cleared all pieces.`);
        // Load each piece:
        for (const piece of pieces) {
            await this.insert(piece);
        }
        // Call onLoadAll:
        this.strategy.onLoadAll(this);
        (_c = Store.logger) === null || _c === void 0 ? void 0 : _c.call(Store, `[STORE => ${this.name}] [LOAD-ALL] Successfully loaded '${this.size}' pieces.`);
    }
    /**
     * Resolves a piece by its name or its instance.
     * @param name The name of the piece or the instance itself.
     * @return The resolved piece.
     */
    resolve(name) {
        if (typeof name === 'string') {
            const result = this.get(name);
            if (typeof result === 'undefined')
                throw new LoaderError_1.LoaderError("UNLOADED_PIECE" /* UnloadedPiece */, `The piece '${name}' does not exist.`);
            return result;
        }
        if (name instanceof this.Constructor)
            return name;
        throw new LoaderError_1.LoaderError("INCORRECT_TYPE" /* IncorrectType */, `The piece '${name.name}' is not an instance of '${this.Constructor.name}'.`);
    }
    /**
     * Inserts a piece into the store.
     * @param piece The piece to be inserted into the store.
     * @return The inserted piece.
     */
    async insert(piece) {
        var _a, _b, _c, _d;
        if (!piece.enabled)
            return piece;
        // Load piece:
        this.strategy.onLoad(this, piece);
        await piece.onLoad();
        (_a = Store.logger) === null || _a === void 0 ? void 0 : _a.call(Store, `[STORE => ${this.name}] [INSERT] Loaded new piece '${piece.name}'.`);
        // If the onLoad disabled the piece, call unload and return it:
        if (!piece.enabled) {
            // Unload piece:
            this.strategy.onUnload(this, piece);
            await piece.onUnload();
            (_b = Store.logger) === null || _b === void 0 ? void 0 : _b.call(Store, `[STORE => ${this.name}] [INSERT] Unloaded new piece '${piece.name}' due to 'enabled' being 'false'.`);
            return piece;
        }
        // Unload existing piece, if any:
        const previous = super.get(piece.name);
        if (previous) {
            await this.unload(previous);
            (_c = Store.logger) === null || _c === void 0 ? void 0 : _c.call(Store, `[STORE => ${this.name}] [INSERT] Unloaded existing piece '${piece.name}' due to conflicting 'name'.`);
        }
        // Set the new piece and return it:
        this.set(piece.name, piece);
        (_d = Store.logger) === null || _d === void 0 ? void 0 : _d.call(Store, `[STORE => ${this.name}] [INSERT] Inserted new piece '${piece.name}'.`);
        return piece;
    }
    /**
     * Constructs a [[Piece]] instance.
     * @param Ctor The [[Piece]]'s constructor used to build the instance.
     * @param path The path of the file.
     * @param name The name of the piece.
     */
    construct(Ctor, data) {
        return new Ctor({ store: this, path: data.path, name: data.name }, { name: data.name, enabled: true });
    }
    /**
     * Loads a directory into the store.
     * @param directory The directory to load the pieces from.
     * @return An async iterator that yields the pieces to be loaded into the store.
     */
    async *loadPath(directory) {
        var _a, _b;
        (_a = Store.logger) === null || _a === void 0 ? void 0 : _a.call(Store, `[STORE => ${this.name}] [WALK] Loading all pieces from '${directory}'.`);
        for await (const child of this.walk(directory)) {
            const data = this.strategy.filter(child);
            if (data === null) {
                (_b = Store.logger) === null || _b === void 0 ? void 0 : _b.call(Store, `[STORE => ${this.name}] [LOAD] Skipped piece '${child}' as 'LoaderStrategy#filter' returned 'null'.`);
                continue;
            }
            try {
                for await (const Ctor of this.strategy.load(this, data)) {
                    yield this.construct(Ctor, data);
                }
            }
            catch (error) {
                this.strategy.onError(error, data.path);
            }
        }
    }
    /**
     * Retrieves all possible pieces.
     * @param path The directory to load the pieces from.
     * @return An async iterator that yields the modules to be processed and loaded into the store.
     */
    async *walk(path) {
        var _a;
        (_a = Store.logger) === null || _a === void 0 ? void 0 : _a.call(Store, `[STORE => ${this.name}] [WALK] Loading all pieces from '${path}'.`);
        try {
            const dir = await fs_1.promises.opendir(path);
            for await (const item of dir) {
                if (item.isFile())
                    yield path_1.join(dir.path, item.name);
                else if (item.isDirectory())
                    yield* this.walk(path_1.join(dir.path, item.name));
            }
        }
        catch (error) {
            // Specifically ignore ENOENT, which is commonly raised by fs operations
            // to indicate that a component of the specified pathname does not exist.
            // No entity (file or directory) could be found by the given path.
            if (error.code !== 'ENOENT')
                this.strategy.onError(error, path);
        }
    }
}
exports.Store = Store;
/**
 * The injected variables that will be accessible to all stores and pieces. To add an extra property, simply mutate
 * the object to add it, and this will update all stores and pieces simultaneously.
 *
 * @example
 * ```typescript
 * // Add a reference to the Client:
 * import { Store } from '(at)sapphire/pieces';
 *
 * export class SapphireClient extends Client {
 *   constructor(options) {
 *     super(options);
 *
 *     Store.injectedContext.client = this;
 *   }
 * }
 *
 * // Can be placed anywhere in a TypeScript file, for JavaScript projects,
 * // you can create an `augments.d.ts` and place the code there.
 * declare module '(at)sapphire/pieces' {
 *   interface PieceContextExtras {
 *     client: SapphireClient;
 *   }
 * }
 *
 * // In any piece, core, plugin, or custom:
 * export class UserCommand extends Command {
 *   public run(message, args) {
 *     // The injected client is available here:
 *     const { client } = this.context;
 *
 *     // ...
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In a plugin's context, e.g. API:
 * class Api extends Plugin {
 *   static [postInitialization]() {
 *     const server = new Server(this);
 *     Store.injectedContext.server = server;
 *
 *     // ...
 *   }
 * }
 *
 * declare module '(at)sapphire/pieces' {
 *   interface PieceContextExtras {
 *     server: Server;
 *   }
 * }
 *
 * // In any piece, even those that aren't routes nor middlewares:
 * export class UserRoute extends Route {
 *   public [methods.POST](message, args) {
 *     // The injected server is available here:
 *     const { server } = this.context;
 *
 *     // ...
 *   }
 * }
 * ```
 */
Object.defineProperty(Store, "injectedContext", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
/**
 * The default strategy, defaults to [[LoaderStrategy]], which is constructed on demand when a store is constructed,
 * when none was set beforehand.
 */
Object.defineProperty(Store, "defaultStrategy", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new LoaderStrategy_1.LoaderStrategy()
});
/**
 * The default logger, defaults to `null`.
 */
Object.defineProperty(Store, "logger", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: null
});
//# sourceMappingURL=Store.js.map