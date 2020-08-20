import Collection from '@discordjs/collection';
import type { AliasPiece } from './AliasPiece';
import { Store } from './Store';
export declare class AliasStore<T extends AliasPiece> extends Store<T> {
    readonly aliases: Collection<string, T>;
    unload(name: string | T): T;
    protected insert(piece: T): T;
}
//# sourceMappingURL=AliasStore.d.ts.map