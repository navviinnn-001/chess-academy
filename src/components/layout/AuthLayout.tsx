import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { BoardBackdrop, KingMotif } from '@/components/ui/ChessMotifs';

export default function AuthLayout({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-navy-950">
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-white/8">
        <BoardBackdrop />
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <Crown size={18} className="text-navy-950" />
          </span>
          <span className="font-display text-[17px] text-ink-100">WE CARE CHESS ACADEMY</span>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center">
          <KingMotif size={300} />
        </div>

        <div className="relative z-10">
          <p className="font-display text-2xl text-ink-100 leading-snug max-w-sm">
            "Every champion was once a student who refused to give up."
          </p>
          <p className="text-sm text-ink-500 mt-3 coord-label">Learn · Think · Strategize · Succeed.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 relative">
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <span className="h-8 w-8 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <Crown size={16} className="text-navy-950" />
          </span>
          <span className="font-display text-sm text-ink-100">WE CARE CHESS</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.9, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          <p className="coord-label text-xs text-gold-400 mb-2">{eyebrow}</p>
          <h1 className="font-display text-3xl text-ink-100 mb-2">{title}</h1>
          <p className="text-sm text-ink-400 mb-8">{subtitle}</p>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
