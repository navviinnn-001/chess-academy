import { type HTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({ children, className, hover = false, glass = false, ...props }: CardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-lg border border-white/8 bg-navy-800/70 shadow-card',
        glass && 'glass',
        hover && 'transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:border-white/14',
        className,
      )}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 p-5 pb-3">
      <div>
        <h3 className="font-display text-lg text-ink-100 tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-ink-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
