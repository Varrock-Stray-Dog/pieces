import Collection from '@discordjs/collection';
import type { Piece, PieceContextExtras } from './Piece';
import type { Constructor, ILoaderResultEntry, ILoaderStrategy } from './strategies/ILoaderStrategy';
/**
 * The options for the store, this features both hooks (changes the behaviour) and handlers (similar to event listeners).
 */
export interface StoreOptions<T extends Piece> {
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
export declare class Store<T extends Piece> extends Collection<string, T> {
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
     * Loads a piece or more from a path.
     * @param path The path of the file to load.
     * @return An async iterator that yields each one of the loaded pieces.
     */
    load(path: string): AsyncIterableIterator<T>;
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
    protected construct(Ctor: ILoaderResultEntry<T>, path: string, name: string): T;
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
//# sourceMappingURL=Store.d.ts.map