import Collection from '@discordjs/collection';

/**
 * A readonly array of any values.
 * @private
 */
declare type Arr = readonly any[];
/**
 * A generic constructor.
 * @private
 */
declare type Ctor<A extends Arr = readonly any[], R = any> = new (...args: A) => R;

declare type Constructor<T> = new (...args: any[]) => T;
declare type Awaited<T> = PromiseLike<T> | T;
/**
 * The module data information.
 */
interface ModuleData {
    /**
     * The name of the module.
     */
    name: string;
    /**
     * The absolute path to the module.
     */
    path: string;
    /**
     * The extension of the module.
     */
    extension: string;
}
/**
 * The result from the filter.
 */
declare type FilterResult = ModuleData | null;
/**
 * Represents the return data from [[ILoaderStrategy.preload]]
 */
declare type PreloadResult<T extends Piece> = Awaited<Constructor<T> & Record<PropertyKey, unknown>>;
/**
 * Represents the return data from [[ILoaderStrategy.preload]]
 */
declare type AsyncPreloadResult<T extends Piece> = Promise<Constructor<T> & Record<PropertyKey, unknown>>;
/**
 * Represents an entry from [[ILoaderResult]].
 */
declare type ILoaderResultEntry<T extends Piece> = Ctor<ConstructorParameters<typeof Piece>, T>;
/**
 * Represents the return data from [[ILoaderStrategy.load]].
 */
declare type ILoaderResult<T extends Piece> = AsyncIterableIterator<ILoaderResultEntry<T>>;
/**
 * An abstracted loader strategy interface.
 */
interface ILoaderStrategy<T extends Piece> {
    /**
     * Retrieves the name and the extension of the specified file path.
     * @param path The path of the file to be processed.
     * @return A [[PieceData]] on success, otherwise `null` to stop the store from processing the path.
     * @example
     * ```typescript
     * // ts-node support
     * class MyStrategy extends LoaderStrategy {
     *   filter(path) {
     *     const extension = extname(path);
     *     if (!['.js', '.ts'].includes(extension)) return null;
     *     const name = basename(path, extension);
     *     return { extension, name };
     *   }
     * }
     */
    filter(path: string): FilterResult;
    /**
     * The pre-load hook, use this to override the loader.
     * @example
     * ```typescript
     * // CommonJS support:
     * class MyStrategy extends LoaderStrategy {
     *   preload(path) {
     *     return require(path);
     *   }
     * }
     * ```
     * @example
     * ```typescript
     * // ESM support:
     * class MyStrategy extends LoaderStrategy {
     *   preload(file) {
     *     return import(file.path);
     *   }
     * }
     * ```
     */
    preload(file: ModuleData): PreloadResult<T>;
    /**
     * The load hook, use this to override the loader.
     * @example
     * ```typescript
     * class MyStrategy extends LoaderStrategy {
     *   load(store, file) {
     *     // ...
     *   }
     * }
     */
    load(store: Store<T>, file: ModuleData): ILoaderResult<T>;
    /**
     * @param store The store that holds the piece.
     * @param piece The piece that was loaded.
     */
    onPostLoad(store: Store<T>, piece: T): unknown;
    /**
     * @param store The store that held the piece.
     * @param piece The piece that was unloaded.
     */
    onUnload(store: Store<T>, piece: T): unknown;
    /**
     * @param error The error that was thrown.
     * @param path The path of the file that caused the error to be thrown.
     */
    onError(error: Error, path: string): void;
}

/**
 * The options for the store, this features both hooks (changes the behaviour) and handlers (similar to event listeners).
 */
interface StoreOptions<T extends Piece> {
    /**
     * The name for this store.
     */
    readonly name: string;
    /**
     * The paths to load pieces from, should be absolute.
     * @default []
     */
    readonly paths?: readonly string[];
    /**
     * The strategy to be used for the loader.
     * @default Store.defaultStrategy
     */
    readonly strategy?: ILoaderStrategy<T>;
}
/**
 * The store class which contains [[Piece]]s.
 */
declare class Store<T extends Piece> extends Collection<string, T> {
    readonly Constructor: Constructor<T>;
    readonly name: string;
    readonly paths: Set<string>;
    readonly strategy: ILoaderStrategy<T>;
    /**
     * @param constructor The piece constructor this store loads.
     * @param options The options for the store.
     */
    constructor(constructor: Constructor<T>, options: StoreOptions<T>);
    /**
     * The extras to be used for dependency injection in all pieces. Returns a reference of [[Store.defaultExtras]].
     */
    get context(): PieceContextExtras;
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
    registerPath(path: string): this;
    /**
     * Loads one or more pieces from a path.
     * @param path The path of the file to load.
     * @return An async iterator that yields each one of the loaded pieces.
     */
    load(path: string): Promise<T[]>;
    /**
     * Unloads a piece given its instance or its name.
     * @param name The name of the file to load.
     * @return Returns the piece that was unloaded.
     */
    unload(name: string | T): Promise<T>;
    /**
     * Loads all pieces from all directories specified by [[paths]].
     */
    loadAll(): Promise<void>;
    /**
     * Resolves a piece by its name or its instance.
     * @param name The name of the piece or the instance itself.
     * @return The resolved piece.
     */
    resolve(name: string | T): T;
    /**
     * Inserts a piece into the store.
     * @param piece The piece to be inserted into the store.
     * @return The inserted piece.
     */
    protected insert(piece: T): Promise<T>;
    /**
     * Constructs a [[Piece]] instance.
     * @param Ctor The [[Piece]]'s constructor used to build the instance.
     * @param path The path of the file.
     * @param name The name of the piece.
     */
    protected construct(Ctor: ILoaderResultEntry<T>, data: ModuleData): T;
    /**
     * Loads a directory into the store.
     * @param directory The directory to load the pieces from.
     * @return An async iterator that yields the pieces to be loaded into the store.
     */
    private loadPath;
    /**
     * Retrieves all possible pieces.
     * @param path The directory to load the pieces from.
     * @return An async iterator that yields the modules to be processed and loaded into the store.
     */
    private walk;
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
    static injectedContext: PieceContextExtras;
    /**
     * The default strategy, defaults to [[LoaderStrategy]], which is constructed on demand when a store is constructed,
     * when none was set beforehand.
     */
    static defaultStrategy: ILoaderStrategy<any> | null;
}

/**
 * Represents the data from [[PieceContext.extras]] and may be used for dependency injection.
 * Libraries can provide strict typing by augmenting this module, check
 * {@link https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation module augmentation}
 * for more information.
 */
interface PieceContextExtras extends Record<PropertyKey, unknown> {
}
/**
 * The context for the piece, contains extra information from the store,
 * the piece's path, and the store that loaded it.
 */
interface PieceContext {
    /**
     * The path the module was loaded from.
     */
    readonly path: string;
    /**
     * The module's name extracted from the path.
     */
    readonly name: string;
    /**
     * The store that loaded the piece.
     */
    readonly store: Store<Piece>;
}
/**
 * The options for the [[Piece]].
 */
interface PieceOptions {
    /**
     * The name for the piece.
     * @default ''
     */
    readonly name?: string;
    /**
     * Whether or not the piece should be enabled. If set to false, the piece will be unloaded.
     * @default true
     */
    readonly enabled?: boolean;
}
/**
 * The piece to be stored in [[Store]] instances.
 */
declare class Piece {
    /**
     * The store that contains the piece.
     */
    readonly store: Store<Piece>;
    /**
     * The path to the piece's file.
     */
    readonly path: string;
    /**
     * The name of the piece.
     */
    readonly name: string;
    /**
     * Whether or not the piece is enabled.
     */
    enabled: boolean;
    constructor(context: PieceContext, options?: PieceOptions);
    /**
     * The context given by the store.
     * @see Store.injectedContext
     */
    get context(): PieceContextExtras;
    /**
     * Per-piece listener that is called when the piece is loaded into the store.
     * Useful to set-up asynchronous initialization tasks.
     */
    onLoad(): Awaited<unknown>;
    /**
     * Per-piece listener that is called when the piece is unloaded from the store.
     * Useful to set-up clean-up tasks.
     */
    onUnload(): Awaited<unknown>;
    /**
     * Disables the piece and removes it from its store
     */
    disable(): Promise<void>;
    toJSON(): Record<string, any>;
}

interface AliasPieceOptions extends PieceOptions {
    /**
     * The aliases for the piece.
     * @default []
     */
    readonly aliases?: readonly string[];
}
/**
 * The piece to be stored in [[AliasStore]] instances.
 */
declare class AliasPiece extends Piece {
    /**
     * The aliases for the piece.
     */
    readonly aliases: readonly string[];
    constructor(context: PieceContext, options?: AliasPieceOptions);
    toJSON(): Record<string, any>;
}

/**
 * The store class which contains [[AliasPiece]]s.
 */
declare class AliasStore<T extends AliasPiece> extends Store<T> {
    /**
     * The aliases referencing to pieces.
     */
    readonly aliases: Collection<string, T>;
    /**
     * Looks up the name by the store, falling back to an alias lookup.
     * @param key The key to look for.
     */
    get(key: string): T | undefined;
    /**
     * Unloads a piece given its instance or its name, and removes all the aliases.
     * @param name The name of the file to load.
     * @return Returns the piece that was unloaded.
     */
    unload(name: string | T): Promise<T>;
    /**
     * Inserts a piece into the store, and adds all the aliases.
     * @param piece The piece to be inserted into the store.
     * @return The inserted piece.
     */
    protected insert(piece: T): Promise<T>;
}

declare const enum LoaderErrorType {
    EmptyModule = "EMPTY_MODULE",
    UnloadedPiece = "UNLOADED_PIECE",
    IncorrectType = "INCORRECT_TYPE"
}
/**
 * Describes a loader error with a type for easy indentification.
 */
declare class LoaderError extends Error {
    /**
     * The type of the error that was thrown.
     */
    readonly type: LoaderErrorType;
    constructor(type: LoaderErrorType, message: string);
    get name(): string;
}

/**
 * Describes a [[LoaderErrorType.EmptyModule]] loader error and adds a path for easy identification.
 */
declare class MissingExportsError extends LoaderError {
    /**
     * The path of the module that did not have exports.
     */
    readonly path: string;
    constructor(path: string);
}

/**
 * A multi-purpose feature-complete loader strategy supporting multi-piece modules as well as supporting both ECMAScript
 * Modules and CommonJS with reloading support.
 */
declare class LoaderStrategy<T extends Piece> implements ILoaderStrategy<T> {
    private readonly clientESM;
    private readonly supportedExtensions;
    filter(path: string): FilterResult;
    preload(file: ModuleData): AsyncPreloadResult<T>;
    load(store: Store<T>, file: ModuleData): ILoaderResult<T>;
    onPostLoad(): unknown;
    onUnload(): unknown;
    onError(error: Error, path: string): void;
}

export { AliasPiece, AliasPieceOptions, AliasStore, AsyncPreloadResult, Awaited, Constructor, FilterResult, ILoaderResult, ILoaderResultEntry, ILoaderStrategy, LoaderError, LoaderErrorType, LoaderStrategy, MissingExportsError, ModuleData, Piece, PieceContext, PieceContextExtras, PieceOptions, PreloadResult, Store, StoreOptions };
