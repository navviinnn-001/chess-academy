import { type ReactNode } from 'react';
import Card from './Card';
import ProgressRing from './ProgressRing';

interface ProgressCardProps {
  label: string;
  value: number;
  color?: string;
  note?: ReactNode;
  size?: number;
  className?: string;
}

export default function ProgressCard({ label, value, color = '#4FBFA0', note, size = 96, className }: ProgressCardProps) {
  return (
    <Card className={`p-6 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 ${className ?? ''}`}>
      <ProgressRing value={value} size={size} color={color} label={label} />
      {note && <p className="text-xs text-ink-500 mt-4">{note}</p>}
    </Card>
  );
}