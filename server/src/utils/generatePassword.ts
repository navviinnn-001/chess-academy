const WORDS = ['Rook', 'Knight', 'Bishop', 'Pawn', 'King', 'Queen', 'Castle', 'Gambit'];

export function generateTempPassword(): string {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${word}${digits}!`;
}
