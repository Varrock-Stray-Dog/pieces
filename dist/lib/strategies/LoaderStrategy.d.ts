import type { Piece } from '../Piece';
import type { Store } from '../Store';
import type { AsyncPreloadResult, FilterResult, ILoaderResult, ILoaderStrategy, ModuleData } from './ILoaderStrategy';
/**
 * A multi-purpose feature-complete loader strategy supporting multi-piece modules as well as supporting both ECMAScript
 * Modules and CommonJS with reloading support.
 */
export declare class LoaderStrategy<T extends Piece> implements ILoaderStrategy<T> {
    private readonly clientESM;
    private readonly supportedExtensions;
    filter(path: string): FilterResult;
    preload(file: ModuleData): AsyncPreloadResult<T>;
    load(store: Store<T>, file: ModuleData): ILoaderResult<T>;
    onPostLoad(): unknown;
    onUnload(): unknown;
    onError(error: Error, path: string): void;
}
//# sourceMappingURL=LoaderStrategy.d.ts.map