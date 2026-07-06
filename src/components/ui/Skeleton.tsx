import { cn } from '@/lib/cn';

export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn('shimmer rounded-md bg-white/5', className)} />;
}
