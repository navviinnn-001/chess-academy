import { motion } from 'framer-motion';

/** Faint chessboard grid used as ambient background texture */
export function BoardBackdrop({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 board-bg bg-radial-fade ${className}`} aria-hidden />
  );
}

/** Abstract 3D-styled king silhouette in blackened metal with antique-gold detailing */
export function KingMotif({ size = 340, floating = true }: { size?: number; floating?: boolean }) {
  const Wrapper = floating ? motion.div : 'div';
  const floatProps = floating
    ? { animate: { y: [0, -14, 0], rotate: [0, 1.1, 0] }, transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }
    : {};
  return (
    <Wrapper {...(floatProps as any)} style={{ width: size, height: size }} className="relative">
      <svg viewBox="0 0 200 240" width={size} height={size} className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]">
        <defs>
          <linearGradient id="kingBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A2A2E" />
            <stop offset="55%" stopColor="#161618" />
            <stop offset="100%" stopColor="#08080A" />
          </linearGradient>
          <linearGradient id="kingGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E4CE9A" />
            <stop offset="100%" stopColor="#8C6E3A" />
          </linearGradient>
          <radialGradient id="kingGlow" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="rgba(79,191,160,0.28)" />
            <stop offset="100%" stopColor="rgba(79,191,160,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="120" rx="95" ry="95" fill="url(#kingGlow)" />
        {/* cross */}
        <rect x="93" y="10" width="14" height="34" rx="3" fill="url(#kingGold)" />
        <rect x="80" y="20" width="40" height="12" rx="3" fill="url(#kingGold)" />
        {/* crown */}
        <path d="M55 60 L145 60 L135 92 L65 92 Z" fill="url(#kingBody)" stroke="#4FBFA0" strokeOpacity="0.2" />
        <circle cx="65" cy="58" r="6" fill="url(#kingGold)" />
        <circle cx="100" cy="52" r="7" fill="url(#kingGold)" />
        <circle cx="135" cy="58" r="6" fill="url(#kingGold)" />
        {/* body */}
        <path d="M70 92 L130 92 L150 210 Q100 232 50 210 Z" fill="url(#kingBody)" stroke="#323338" />
        <path d="M60 150 Q100 168 140 150" stroke="url(#kingGold)" strokeWidth="2" fill="none" opacity="0.55" />
        <path d="M55 185 Q100 205 145 185" stroke="url(#kingGold)" strokeWidth="2" fill="none" opacity="0.45" />
        <ellipse cx="100" cy="222" rx="62" ry="10" fill="#050505" opacity="0.7" />
      </svg>
    </Wrapper>
  );
}

/** Abstract 3D-styled knight silhouette, used as a secondary hero/ambient piece */
export function KnightMotif({ size = 280, floating = true }: { size?: number; floating?: boolean }) {
  const Wrapper = floating ? motion.div : 'div';
  const floatProps = floating
    ? { animate: { y: [0, -10, 0], rotate: [0, -1, 0] }, transition: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 } }
    : {};
  return (
    <Wrapper {...(floatProps as any)} style={{ width: size, height: size }} className="relative">
      <svg viewBox="0 0 200 220" width={size} height={size} className="drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
        <defs>
          <linearGradient id="knightBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A2A2E" />
            <stop offset="60%" stopColor="#161618" />
            <stop offset="100%" stopColor="#08080A" />
          </linearGradient>
          <linearGradient id="knightGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E4CE9A" />
            <stop offset="100%" stopColor="#8C6E3A" />
          </linearGradient>
        </defs>
        <path
          d="M120 20 C90 18 68 34 60 60 C54 80 62 92 50 104 C40 114 34 128 38 146 L58 146 C58 138 62 132 70 130 L70 190 Q100 206 140 190 L140 100 C150 88 156 70 148 52 C142 38 132 26 120 20 Z"
          fill="url(#knightBody)" stroke="#323338"
        />
        <circle cx="118" cy="52" r="5.5" fill="url(#knightGold)" />
        <path d="M60 100 Q80 92 96 100" stroke="url(#knightGold)" strokeWidth="2" fill="none" opacity="0.5" />
        <ellipse cx="98" cy="200" rx="46" ry="8" fill="#050505" opacity="0.65" />
      </svg>
    </Wrapper>
  );
}

/** Tactical move-arrow motif, evoking a highlighted engine line */
export function MoveArrow({ className = '', color = '#4FBFA0' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 240 80" className={className} fill="none">
      <path d="M4 60 C 60 60, 90 20, 160 20" stroke={color} strokeOpacity="0.5" strokeWidth="2" strokeDasharray="5 7" />
      <path d="M150 12 L166 20 L150 28 Z" fill={color} fillOpacity="0.5" />
    </svg>
  );
}

/** Thin tactical line network used inside AmbientBackground for depth */
export function TacticalLines({ className = '', opacity = 0.16 }: { className?: string; opacity?: number }) {
  return (
    <svg className={className} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden>
      <g stroke="#CBA968" strokeOpacity={opacity} strokeWidth="1">
        <path d="M-50 620 L340 420 L720 540 L1250 220" strokeDasharray="3 9" />
        <path d="M-50 120 L300 260 L640 140 L1000 300 L1250 180" strokeDasharray="3 9" />
      </g>
      <g stroke="#4FBFA0" strokeOpacity={opacity * 0.8} strokeWidth="1">
        <path d="M-50 720 L260 560 L560 680 L900 480 L1250 620" strokeDasharray="2 10" />
      </g>
      {[[340, 420], [720, 540], [300, 260], [640, 140], [560, 680], [900, 480]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#CBA968" fillOpacity={opacity + 0.1} />
      ))}
    </svg>
  );
}

/** Small coordinate label used decoratively, e.g. "e4", "Nf3" */
export function CoordTag({ children }: { children: string }) {
  return (
    <span className="coord-label text-[11px] text-gold-400/75 border border-gold-500/20 rounded px-1.5 py-0.5 bg-gold-500/5">
      {children}
    </span>
  );
}

/** Highlighted square pattern for empty states / accents */
export function SquareHighlight({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <rect x="4" y="4" width="112" height="112" rx="10" stroke="#4FBFA0" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="60" cy="60" r="26" fill="#4FBFA0" fillOpacity="0.07" />
      <circle cx="60" cy="60" r="6" fill="#4FBFA0" fillOpacity="0.45" />
    </svg>
  );
}

/** Small ivory-and-graphite board glyph used as a decorative corner mark */
export function BoardGlyph({ size = 56 }: { size?: number }) {
  const squares = Array.from({ length: 16 }, (_, i) => i);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="opacity-80">
      <rect width="64" height="64" rx="6" fill="#0A0A0B" stroke="#8C6E3A" strokeOpacity="0.3" />
      {squares.map((i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const dark = (row + col) % 2 === 0;
        return <rect key={i} x={4 + col * 14} y={4 + row * 14} width="14" height="14" fill={dark ? '#1B1B1F' : '#EFE9DB'} fillOpacity={dark ? 1 : 0.9} />;
      })}
    </svg>
  );
}