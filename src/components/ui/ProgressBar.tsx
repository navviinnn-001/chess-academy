import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export default function ProgressBar({ value, color = 'bg-emerald-500', className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-white/8 overflow-hidden', className)}>
      <motion.div
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
      />
    </div>
  );
}
