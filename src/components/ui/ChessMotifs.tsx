import { motion } from 'framer-motion';

/** Faint chessboard grid used as ambient background texture */
export function BoardBackdrop({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 board-bg bg-radial-fade ${className}`} aria-hidden />
  );
}

/** Abstract 3D-styled king silhouette, the academy's signature mark */
export function KingMotif({ size = 340, floating = true }: { size?: number; floating?: boolean }) {
  const Wrapper = floating ? motion.div : 'div';
  const floatProps = floating
    ? { animate: { y: [0, -14, 0], rotate: [0, 1.1, 0] }, transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }
    : {};
  return (
    <Wrapper {...(floatProps as any)} style={{ width: size, height: size }} className="relative">
      <svg viewBox="0 0 200 240" width={size} height={size} className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]">
        <defs>
          <linearGradient id="kingBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#243458" />
            <stop offset="55%" stopColor="#141F3C" />
            <stop offset="100%" stopColor="#0A0F1E" />
          </linearGradient>
          <linearGradient id="kingGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0DBA0" />
            <stop offset="100%" stopColor="#B8924A" />
          </linearGradient>
          <radialGradient id="kingGlow" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="rgba(63,203,166,0.35)" />
            <stop offset="100%" stopColor="rgba(63,203,166,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="120" rx="95" ry="95" fill="url(#kingGlow)" />
        {/* cross */}
        <rect x="93" y="10" width="14" height="34" rx="3" fill="url(#kingGold)" />
        <rect x="80" y="20" width="40" height="12" rx="3" fill="url(#kingGold)" />
        {/* crown */}
        <path d="M55 60 L145 60 L135 92 L65 92 Z" fill="url(#kingBody)" stroke="#3FCBA6" strokeOpacity="0.25" />
        <circle cx="65" cy="58" r="6" fill="url(#kingGold)" />
        <circle cx="100" cy="52" r="7" fill="url(#kingGold)" />
        <circle cx="135" cy="58" r="6" fill="url(#kingGold)" />
        {/* body */}
        <path d="M70 92 L130 92 L150 210 Q100 232 50 210 Z" fill="url(#kingBody)" stroke="#293F70" />
        <path d="M60 150 Q100 168 140 150" stroke="url(#kingGold)" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M55 185 Q100 205 145 185" stroke="url(#kingGold)" strokeWidth="2" fill="none" opacity="0.5" />
        <ellipse cx="100" cy="222" rx="62" ry="10" fill="#05070F" opacity="0.6" />
      </svg>
    </Wrapper>
  );
}

/** Tactical move-arrow motif, evoking a highlighted engine line */
export function MoveArrow({ className = '', color = '#3FCBA6' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 240 80" className={className} fill="none">
      <path d="M4 60 C 60 60, 90 20, 160 20" stroke={color} strokeOpacity="0.55" strokeWidth="2" strokeDasharray="5 7" />
      <path d="M150 12 L166 20 L150 28 Z" fill={color} fillOpacity="0.55" />
    </svg>
  );
}

/** Small coordinate label used decoratively, e.g. "e4", "Nf3" */
export function CoordTag({ children }: { children: string }) {
  return (
    <span className="coord-label text-[11px] text-gold-400/70 border border-gold-500/20 rounded px-1.5 py-0.5 bg-gold-500/5">
      {children}
    </span>
  );
}

/** Highlighted square pattern for empty states / accents */
export function SquareHighlight({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <rect x="4" y="4" width="112" height="112" rx="10" stroke="#3FCBA6" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="60" cy="60" r="26" fill="#3FCBA6" fillOpacity="0.08" />
      <circle cx="60" cy="60" r="6" fill="#3FCBA6" fillOpacity="0.5" />
    </svg>
  );
}
