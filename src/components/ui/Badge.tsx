import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'gold' | 'info';

const tones: Record<Tone, string> = {
  success: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/25',
  warning: 'bg-warning/12 text-warning border-warning/25',
  danger: 'bg-danger/12 text-danger border-danger/25',
  neutral: 'bg-white/6 text-ink-300 border-white/12',
  gold: 'bg-gold-500/12 text-gold-300 border-gold-500/25',
  info: 'bg-navy-600/60 text-ink-300 border-white/10',
};

export default function Badge({ tone = 'neutral', children, dot }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone])}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', tone === 'success' && 'bg-emerald-400', tone === 'warning' && 'bg-warning', tone === 'danger' && 'bg-danger', tone === 'gold' && 'bg-gold-400', tone === 'neutral' && 'bg-ink-400')} />}
      {children}
    </span>
  );
}
