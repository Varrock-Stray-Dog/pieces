import { Piece, PieceContext, PieceOptions } from './Piece';
export interface AliasPieceOptions extends PieceOptions {
    readonly aliases?: readonly string[];
}
export declare class AliasPiece extends Piece {
    readonly aliases: readonly string[];
    constructor(context: PieceContext, options?: AliasPieceOptions);
}
//# sourceMappingURL=AliasPiece.d.ts.map