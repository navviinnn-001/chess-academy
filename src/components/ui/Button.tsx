import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'gold' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  full?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-emerald-500 text-navy-950 hover:bg-emerald-400 shadow-glow',
  gold: 'bg-gradient-to-b from-gold-400 to-gold-500 text-navy-950 hover:from-gold-300 hover:to-gold-400 shadow-gold',
  ghost: 'bg-transparent text-ink-200 hover:bg-white/5',
  outline: 'bg-transparent text-ink-100 border border-white/15 hover:border-gold-400/60 hover:text-gold-300',
  danger: 'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3.5 gap-2.5',
};

export default function Button({
  variant = 'primary', size = 'md', icon, iconRight, children, className, full, ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.14, ease: [0.22, 0.9, 0.3, 1] }}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap',
        variants[variant], sizes[size], full && 'w-full', className,
      )}
      {...(props as any)}
    >
      {icon}
      {children}
      {iconRight}
    </motion.button>
  );
}
