import { KingMotif, KnightMotif, BoardGlyph, MoveArrow, SquareHighlight, CoordTag } from './ChessMotifs';

type Piece = 'king' | 'knight' | 'board' | 'arrow' | 'square' | 'coord';

interface ChessVisualProps {
  piece: Piece;
  size?: number;
  floating?: boolean;
  className?: string;
  label?: string; // for 'coord'
}

/**
 * Single entry point for the app's chess-inspired visual system. Prefer this over importing
 * individual pieces from ChessMotifs directly when placing decorative art in a page or hero.
 */
export default function ChessVisual({ piece, size, floating, className, label }: ChessVisualProps) {
  switch (piece) {
    case 'king':
      return <KingMotif size={size} floating={floating} />;
    case 'knight':
      return <KnightMotif size={size} floating={floating} />;
    case 'board':
      return <BoardGlyph size={size} />;
    case 'arrow':
      return <MoveArrow className={className} />;
    case 'square':
      return <SquareHighlight size={size} />;
    case 'coord':
      return <CoordTag>{label ?? 'e4'}</CoordTag>;
    default:
      return null;
  }
}