import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';
import AnimatedCounter from './AnimatedCounter';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  suffix?: string;
  trend?: { direction: 'up' | 'down'; label: string };
  tone?: 'emerald' | 'gold' | 'neutral';
  className?: string;
}

const toneRing: Record<string, string> = {
  emerald: 'group-hover:shadow-glow group-hover:border-emerald-500/25',
  gold: 'group-hover:shadow-gold group-hover:border-gold-500/25',
  neutral: 'group-hover:border-white/14',
};

const iconTone: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400',
  gold: 'bg-gold-500/10 text-gold-400',
  neutral: 'bg-white/5 text-ink-300',
};

export default function StatCard({ label, value, icon, suffix = '', trend, tone = 'neutral', className }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.28, ease: [0.22, 0.9, 0.3, 1] }} className="group">
      <Card className={cn('p-5 transition-all duration-300 border-white/8', toneRing[tone], className)}>
        <div className="flex items-center justify-between mb-4">
          <div className={cn('h-10 w-10 rounded-md flex items-center justify-center', iconTone[tone])}>{icon}</div>
          {trend && (
            <span className={cn('inline-flex items-center gap-1 text-xs', trend.direction === 'up' ? 'text-emerald-400' : 'text-danger')}>
              {trend.direction === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {trend.label}
            </span>
          )}
        </div>
        <p className="editorial-heading text-3xl text-ink-100">
          <AnimatedCounter value={value} suffix={suffix} />
        </p>
        <p className="text-xs text-ink-400 mt-1.5">{label}</p>
      </Card>
    </motion.div>
  );
}