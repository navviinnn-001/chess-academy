import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import AmbientBackground from '@/components/ui/AmbientBackground';
import { KingMotif, KnightMotif, CoordTag } from '@/components/ui/ChessMotifs';

export default function AuthLayout({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="relative min-h-screen grid lg:grid-cols-2">
      <AmbientBackground intensity="full" />

      {/* Left: cinematic chess-arena composition */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r hairline-gold">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.9, 0.3, 1] }}
          className="relative z-10 flex items-center gap-2.5"
        >
          <span className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-glow">
            <Crown size={18} className="text-navy-950" />
          </span>
          <span className="editorial-heading text-[17px] text-ink-100">WE CARE CHESS ACADEMY</span>
        </motion.div>

        <div className="relative z-10 flex-1 flex items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 0.9, 0.3, 1] }}
            className="hidden xl:block opacity-70 -mr-6"
          >
            <KnightMotif size={150} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 0.9, 0.3, 1] }}
          >
            <KingMotif size={300} />
          </motion.div>
          <div className="hidden xl:flex flex-col gap-3 -ml-2">
            <CoordTag>e4</CoordTag>
            <CoordTag>Nf3</CoordTag>
            <CoordTag>O-O</CoordTag>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 0.9, 0.3, 1] }}
          className="relative z-10"
        >
          <p className="editorial-heading text-2xl text-ink-100 leading-snug max-w-sm">
            "Every champion was once a student who refused to give up."
          </p>
          <p className="text-sm text-ink-500 mt-3 coord-label">Learn · Think · Strategize · Succeed.</p>
        </motion.div>
      </div>

      {/* Right: the form */}
      <div className="relative flex items-center justify-center p-6 md:p-12">
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2 z-10">
          <span className="h-8 w-8 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <Crown size={16} className="text-navy-950" />
          </span>
          <span className="editorial-heading text-sm text-ink-100">WE CARE CHESS</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.9, 0.3, 1] }}
          className="relative z-10 w-full max-w-[400px] rounded-xl border border-white/8 bg-navy-900/60 backdrop-blur-md p-7 md:p-8 shadow-elevate"
        >
          <p className="coord-label text-xs text-gold-400 mb-2">{eyebrow}</p>
          <h1 className="editorial-heading text-3xl text-ink-100 mb-2">{title}</h1>
          {subtitle && <p className="text-sm text-ink-400 mb-8">{subtitle}</p>}
          {children}
        </motion.div>
      </div>
    </div>
  );
}