import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, PuzzleIcon } from 'lucide-react';
import StudentLayout from '@/components/layout/StudentLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { SquareHighlight } from '@/components/ui/ChessMotifs';
import { api } from '@/lib/api';
import type { Difficulty } from '@/types';

interface PuzzleDto {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  instruction: string;
  completed: boolean;
}

const diffTone: Record<Difficulty, 'success' | 'gold' | 'warning' | 'danger'> = {
  Beginner: 'success', Easy: 'gold', Intermediate: 'warning', Advanced: 'danger',
};

export default function PuzzlePractice() {
  const [puzzles, setPuzzles] = useState<PuzzleDto[] | null>(null);

  useEffect(() => {
    api.get<{ puzzles: PuzzleDto[] }>('/puzzles').then(r => setPuzzles(r.puzzles));
  }, []);

  return (
    <StudentLayout title="Puzzle Practice">
      <p className="text-sm text-ink-400 mb-6 max-w-xl">A focused set of positions from your coach. Solve, check your answer, and review the explanation.</p>

      {!puzzles ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52 w-full" />)}</div>
      ) : puzzles.length === 0 ? (
        <Card><EmptyState icon={<PuzzleIcon size={22} />} title="No puzzles yet" description="Your coach hasn't published this week's puzzle set." /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {puzzles.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 0.9, 0.3, 1] }}>
              <Link to={`/student/puzzles/${p.id}`}>
                <Card hover className="overflow-hidden h-full">
                  <div className="h-32 bg-navy-700/60 flex items-center justify-center relative border-b border-white/8">
                    <SquareHighlight size={90} />
                    {p.completed && (
                      <span className="absolute top-3 right-3 h-6 w-6 rounded-full bg-navy-950/70 flex items-center justify-center">
                        <CheckCircle2 size={15} className="text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge tone={diffTone[p.difficulty]}>{p.difficulty}</Badge>
                      <Badge tone="neutral">{p.topic}</Badge>
                    </div>
                    <h3 className="text-sm font-medium text-ink-100">{p.title}</h3>
                    <p className="text-xs text-ink-400 mt-1.5">{p.instruction}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
}
