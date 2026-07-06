import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb, CheckCircle2, Youtube, Sparkles } from 'lucide-react';
import StudentLayout from '@/components/layout/StudentLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import { SquareHighlight } from '@/components/ui/ChessMotifs';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import type { Difficulty } from '@/types';

interface PuzzleDto {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  instruction: string;
  hint: string;
  completed: boolean;
}

export default function PuzzleDetail() {
  const { id } = useParams();
  const [puzzle, setPuzzle] = useState<PuzzleDto | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState<{ answer: string; explanation: string; youtubeLink?: string } | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [solved, setSolved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    if (!id) return;
    api.get<{ puzzle: PuzzleDto }>(`/puzzles/${id}`).then(r => {
      setPuzzle(r.puzzle);
      setSolved(r.puzzle.completed);
    });
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      const res = await api.post<{ correct: boolean; answer?: string; explanation?: string; youtubeLink?: string }>(`/puzzles/${id}/submit`, { answer });
      if (res.correct) {
        setSolved(true);
        setRevealed({ answer: res.answer!, explanation: res.explanation!, youtubeLink: res.youtubeLink });
        push('Correct! Puzzle solved.');
      } else {
        setWrongAttempt(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReveal = async () => {
    if (!id) return;
    const res = await api.post<{ answer: string; explanation: string; youtubeLink?: string }>(`/puzzles/${id}/reveal`);
    setRevealed(res);
  };

  if (!puzzle) {
    return (
      <StudentLayout title="Puzzle Practice">
        <Skeleton className="h-96 w-full" />
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Puzzle Practice">
      <Link to="/student/puzzles" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100 mb-6">
        <ArrowLeft size={15} /> Back to puzzles
      </Link>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <div className="aspect-square bg-navy-700/60 flex items-center justify-center border-b border-white/8 board-bg">
              <SquareHighlight size={220} />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge tone="gold">{puzzle.topic}</Badge>
                <Badge tone="neutral">{puzzle.difficulty}</Badge>
              </div>
              <h1 className="font-display text-xl text-ink-100">{puzzle.title}</h1>
              <p className="text-sm text-ink-300 mt-2">{puzzle.instruction}</p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <AnimatePresence mode="wait">
            {solved && revealed ? (
              <motion.div key="solved" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="p-6 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 15 }}>
                    <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-3" />
                  </motion.div>
                  <p className="font-display text-lg text-ink-100">Well solved!</p>
                  <Sparkles size={14} className="text-gold-400 mx-auto mt-1" />
                  <div className="mt-5 text-left">
                    <p className="text-xs text-ink-500 mb-1">Explanation</p>
                    <p className="text-sm text-ink-300 leading-relaxed">{revealed.explanation}</p>
                  </div>
                  {revealed.youtubeLink && (
                    <a href={revealed.youtubeLink} target="_blank" rel="noreferrer">
                      <Button variant="outline" full icon={<Youtube size={15} />} className="mt-5">Watch explanation video</Button>
                    </a>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div key="solving" className="space-y-5">
                <Card className="p-5">
                  <button onClick={() => setShowHint(s => !s)} className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300">
                    <Lightbulb size={15} /> {showHint ? 'Hide hint' : 'Reveal hint'}
                  </button>
                  <AnimatePresence>
                    {showHint && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-ink-300 mt-3 overflow-hidden"
                      >
                        {puzzle.hint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </Card>

                <Card className="p-5">
                  <p className="text-xs text-ink-500 mb-3">Your answer</p>
                  <Input placeholder="e.g. Nf6+" value={answer} onChange={e => { setAnswer(e.target.value); setWrongAttempt(false); }}
                    error={wrongAttempt ? 'Not quite — try reviewing the hint.' : undefined} />
                  <div className="flex gap-3 mt-4">
                    <Button variant="primary" full onClick={handleSubmit} disabled={submitting || !answer}>{submitting ? 'Checking…' : 'Submit Answer'}</Button>
                  </div>
                  <button onClick={handleReveal} className="text-xs text-ink-500 hover:text-ink-300 mt-3">Reveal solution instead</button>
                </Card>

                {revealed && !solved && (
                  <Card className="p-5">
                    <p className="text-xs text-ink-500 mb-1.5">Solution</p>
                    <p className="text-sm text-ink-100 font-medium coord-label">{revealed.answer}</p>
                    <p className="text-sm text-ink-300 leading-relaxed mt-3">{revealed.explanation}</p>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </StudentLayout>
  );
}
