import type { Store } from './Store';
/**
 * The context for the piece, contains extra information from the store,
 * the piece's path, and the store that loaded it.
 */
export interface PieceContext {
    /**
     * The extra information for the piece.
     */
    context: unknown;
    /**
     * The path the piece was loaded from.
     */
    readonly path: string;
    /**
     * The store that loaded the piece.
     */
    readonly store: Store<Piece>;
}
/**
 * The options for the [[Piece]].
 */
export interface PieceOptions {
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
export declare class Piece {
    /**
     * The context given by the store.
     */
    readonly context: unknown;
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
}
//# sourceMappingURL=Piece.d.ts.map