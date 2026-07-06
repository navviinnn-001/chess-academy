import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.9, 0.3, 1] }}
        className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-ink-400 mb-4"
      >
        {icon}
      </motion.div>
      <h4 className="font-display text-lg text-ink-100">{title}</h4>
      <p className="text-sm text-ink-400 mt-1.5 max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
