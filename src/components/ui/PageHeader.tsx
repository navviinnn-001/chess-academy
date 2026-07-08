import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({ eyebrow, title, subtitle, actions, className = '' }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 0.9, 0.3, 1] }}
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}
    >
      <div>
        {eyebrow && <p className="coord-label text-xs text-gold-400 mb-2">{eyebrow}</p>}
        <h1 className="editorial-heading text-2xl md:text-3xl text-ink-100">{title}</h1>
        {subtitle && <p className="text-sm text-ink-400 mt-1.5 max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </motion.div>
  );
}