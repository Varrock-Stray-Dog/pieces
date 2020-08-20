export interface PieceContext {
    context: unknown;
    path: string;
}
export interface PieceOptions {
    name?: string;
    enabled?: boolean;
}
export declare class Piece {
    readonly context: unknown;
    readonly path: string;
    readonly name: string;
    enabled: boolean;
    constructor(context: PieceContext, options?: PieceOptions);
}
//# sourceMappingURL=Piece.d.ts.map