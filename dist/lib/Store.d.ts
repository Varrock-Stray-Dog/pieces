import Collection from '@discordjs/collection';
import type { Piece } from './Piece';
import type { IPiece } from './strategies/ILoader';
declare type Constructor<T> = new (...args: any[]) => T;
declare type Awaited<T> = PromiseLike<T> | T;
/**
 * The error handler.
 */
export interface StoreOptionsErrorHandler {
    /**
     * @param error The error that was thrown.
     * @param path The path of the file that caused the error to be thrown.
     */
    (error: Error, path: string): void;
}
/**
 * The pre-load hook, use this to override the loader.
 * @example
 * ```typescript
 * // CommonJS support:
 * ((path) => require(path))
 * ```
 * @example
 * ```typescript
 * // ESM support:
 * ((path) => import(path))
 * ```
 */
export interface StoreOptionsPreLoadHook<T extends Piece> {
    /**
     * @param path The path of the file to be loaded.
     */
    (path: string): Awaited<Constructor<T> & Record<PropertyKey, unknown>>;
}
/**
 * The load hook, use this to override the loader.
 * @example
 * ```typescript
 * // Using multi-loader:
 * import { LoadMultiple } from '@sapphire/cache';
 *
 * new Store(MyPiece, {
 *   onLoad: LoadMultiple.onLoad.bind(LoadMultiple)
 * });
 */
export interface StoreOptionsLoadHook<T extends Piece> {
    (store: Store<T>, path: string): AsyncIterableIterator<IPiece<T>>;
}
/**
 * The post-load handler.
 */
export interface StoreOptionsPostLoadHandler<T extends Piece> {
    /**
     * @param store The store that holds the piece.
     * @param piece The piece that was loaded.
     */
    (store: Store<T>, piece: T): void;
}
/**
 * The unload handler.
 */
export interface StoreOptionsUnLoadHandler<T extends Piece> {
    /**
     * @param store The store that held the piece.
     * @param piece The piece that was unloaded.
     */
    (store: Store<T>, piece: T): void;
}
/**
 * The options for the store, this features both hooks (changes the behaviour) and handlers (similar to event listeners).
 */
export interface StoreOptions<T extends Piece, C = unknown> {
    /**
     * The paths to load pieces from, should be absolute.
     */
    readonly paths?: readonly string[];
    /**
     * The context to be passed to the pieces.
     */
    readonly context?: C;
    /**
     * The preload hook. Setting this will modify the behaviour of the store.
     * @default ((path) => Promise.resolve().then(() => require(path))
     */
    readonly onPreload?: StoreOptionsPreLoadHook<T>;
    /**
     * The load hook. Setting this will modify the behaviour of the store.
     * @default LoadSingle.onLoad.bind(LoadSingle)
     */
    readonly onLoad?: StoreOptionsLoadHook<T>;
    /**
     * The post-load handler.
     * @default (() => void 0)
     */
    readonly onPostLoad?: StoreOptionsPostLoadHandler<T>;
    /**
     * The unload handler.
     * @default (() => void 0)
     */
    readonly onUnload?: StoreOptionsUnLoadHandler<T>;
    /**
     * The error handler.
     * @default (error) => console.error(error)
     */
    readonly onError?: StoreOptionsErrorHandler;
}
export declare class Store<T extends Piece> extends Collection<string, T> {
    readonly Constructor: Constructor<T>;
    readonly paths: readonly string[];
    readonly context: unknown;
    readonly onPreload: StoreOptionsPreLoadHook<T>;
    readonly onLoad: StoreOptionsLoadHook<T>;
    readonly onPostLoad: StoreOptionsPostLoadHandler<T>;
    readonly onUnload: StoreOptionsUnLoadHandler<T>;
    readonly onError: StoreOptionsErrorHandler;
    constructor(constructor: Constructor<T>, options?: StoreOptions<T>);
    load(path: string): AsyncIterableIterator<T>;
    unload(name: string | T): T;
    loadAll(): Promise<void>;
    resolve(name: string | T): T;
    protected insert(piece: T): T;
    private loadPath;
    private walk;
}
export {};
//# sourceMappingURL=Store.d.ts.map