import { motion } from 'framer-motion';
import { KingMotif, TacticalLines } from './ChessMotifs';

interface AmbientBackgroundProps {
  /** 'full' for hero/auth screens (stronger silhouette + glow), 'subtle' for app interiors */
  intensity?: 'full' | 'subtle';
  className?: string;
}

const particles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${(i * 9.7) % 100}%`,
  top: `${(i * 17.3) % 100}%`,
  delay: (i % 5) * 1.4,
  size: 2 + (i % 3),
}));

/**
 * The academy's signature cinematic atmosphere: near-black graphite base, a faint chessboard
 * grid, slow-drifting emerald/gold radial light, a low-opacity chess silhouette, and a handful
 * of ambient particles. Always `pointer-events-none` and behind content (`-z-10`), and every
 * motion element is disabled via `prefers-reduced-motion` (see src/styles/index.css).
 */
export default function AmbientBackground({ intensity = 'subtle', className = '' }: AmbientBackgroundProps) {
  const isFull = intensity === 'full';

  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy-900 ${className}`} aria-hidden>
      {/* Base graphite gradient with a soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#141416_0%,#0A0A0B_55%,#050505_100%)]" />

      {/* Faint chessboard grid */}
      <div className={`absolute inset-0 board-bg ${isFull ? 'opacity-70' : 'opacity-40'}`} />

      {/* Slow-drifting emerald glow */}
      <motion.div
        className="absolute -top-1/4 left-1/3 h-[60vh] w-[60vh] rounded-full bg-emerald-600/10 blur-[110px] animate-drift"
      />
      {/* Slow-drifting antique-gold glow */}
      <motion.div
        className="absolute bottom-[-10%] right-[-5%] h-[50vh] w-[50vh] rounded-full bg-gold-600/8 blur-[120px] animate-driftSlow"
      />

      {/* Tactical line network for depth */}
      <TacticalLines className="absolute inset-0 h-full w-full" opacity={isFull ? 0.14 : 0.07} />

      {/* Chess silhouette, very low opacity, anchored to one side */}
      {isFull && (
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 opacity-[0.14]">
          <KingMotif size={520} />
        </div>
      )}

      {/* Ambient particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-gold-300 animate-particleFloat"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Film-grain texture, extremely subtle */}
      <div className="absolute inset-0 noise-layer opacity-[0.025]" />

      {/* Vignette to keep edges dark and focus centered */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_40%,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}