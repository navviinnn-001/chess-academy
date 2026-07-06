import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Video, BookOpen, PuzzleIcon, Megaphone, ArrowRight, PlayCircle } from 'lucide-react';
import StudentLayout from '@/components/layout/StudentLayout';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressRing from '@/components/ui/ProgressRing';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useCountdown } from '@/hooks/useCountdown';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { MoveArrow } from '@/components/ui/ChessMotifs';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 0.9, 0.3, 1] } } };

interface DashboardData {
  nextClass: { _id: string; topic: string; dateTime: string } | null;
  latestUpdate: { week: string; strengths: string; improvementArea: string; topicsCovered: string[] } | null;
  featuredLearning: { id: string; title: string } | null;
  featuredPuzzle: { id: string; title: string } | null;
  announcement: { title: string; body: string } | null;
  stats: { attendancePct: number; learningPct: number; puzzlePct: number };
}

function NextClassCountdown({ dateTime }: { dateTime: string }) {
  const countdown = useCountdown(dateTime);
  return (
    <div className="flex gap-2 mt-4 coord-label text-xs text-ink-300">
      {[{ l: 'D', v: countdown.days }, { l: 'H', v: countdown.hours }, { l: 'M', v: countdown.minutes }, { l: 'S', v: countdown.seconds }].map(u => (
        <div key={u.l} className="bg-navy-700/70 border border-white/8 rounded-md px-3 py-2 text-center min-w-[52px]">
          <div className="text-ink-100 text-base">{String(u.v).padStart(2, '0')}</div>
          <div className="text-[10px] text-ink-500">{u.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardData>('/me/dashboard').then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <StudentLayout title="Dashboard">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-44 w-full" />
          <div className="grid lg:grid-cols-3 gap-6">
            <Skeleton className="h-40 lg:col-span-2" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </StudentLayout>
    );
  }

  const nextClass = data?.nextClass;
  const latestUpdate = data?.latestUpdate;
  const stats = data?.stats ?? { attendancePct: 0, learningPct: 0, puzzlePct: 0 };

  return (
    <StudentLayout title="Dashboard">
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={item}>
          <h2 className="font-display text-2xl text-ink-100">Good to see you, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-sm text-ink-400 mt-1">Here's what's on your board today.</p>
        </motion.div>

        {nextClass ? (
          <motion.div variants={item}>
            <Card className="relative overflow-hidden p-6 md:p-7 border-emerald-500/20">
              <MoveArrow className="absolute -top-3 -right-4 w-52 opacity-40" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <div>
                  <Badge tone="neutral" dot>Next class</Badge>
                  <h3 className="font-display text-xl md:text-2xl text-ink-100 mt-3">{nextClass.topic}</h3>
                  <p className="text-sm text-ink-400 mt-1.5">{new Date(nextClass.dateTime).toLocaleString('en-IN', { weekday: 'long', hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' })}</p>
                  <NextClassCountdown dateTime={nextClass.dateTime} />
                </div>
                <Button size="lg" variant="primary" icon={<Video size={18} />}>Join Class</Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={item}>
            <Card><EmptyState icon={<Video size={22} />} title="No upcoming class scheduled" description="Your coach hasn't scheduled the next class yet." /></Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader title="Latest Coach Update" subtitle={latestUpdate?.week} action={<Link to="/student/weekly-updates" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">View all <ArrowRight size={13} /></Link>} />
              <div className="px-5 pb-5 space-y-3">
                {latestUpdate ? (
                  <>
                    <p className="text-sm text-ink-300 leading-relaxed"><span className="text-ink-500">Strengths — </span>{latestUpdate.strengths}</p>
                    <p className="text-sm text-ink-300 leading-relaxed"><span className="text-ink-500">Focus area — </span>{latestUpdate.improvementArea}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {latestUpdate.topicsCovered?.map(t => <Badge key={t} tone="info">{t}</Badge>)}
                    </div>
                  </>
                ) : <p className="text-sm text-ink-500">No coach update yet — check back after your first class.</p>}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader title="This Month" />
              <div className="px-5 pb-6 flex justify-between">
                <ProgressRing value={stats.attendancePct} size={76} label="Attend." />
                <ProgressRing value={stats.learningPct} size={76} color="#D4AF6A" label="Learning" />
                <ProgressRing value={stats.puzzlePct} size={76} color="#3FCBA6" label="Puzzles" />
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={item}>
            <Card hover className="p-5 flex gap-4 items-center">
              <div className="h-16 w-16 rounded-md bg-gradient-to-br from-emerald-700 to-navy-800 flex items-center justify-center shrink-0">
                <PlayCircle size={26} className="text-emerald-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-ink-500 flex items-center gap-1.5"><BookOpen size={12} /> Featured Resource</p>
                <h4 className="text-sm text-ink-100 font-medium mt-1 truncate">{data?.featuredLearning?.title ?? 'No resources yet'}</h4>
                <Link to="/student/learning-hub" className="text-xs text-emerald-400 hover:text-emerald-300 mt-1.5 inline-block">Continue learning →</Link>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card hover className="p-5 flex gap-4 items-center">
              <div className="h-16 w-16 rounded-md bg-gradient-to-br from-gold-600 to-navy-800 flex items-center justify-center shrink-0">
                <PuzzleIcon size={24} className="text-gold-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-ink-500 flex items-center gap-1.5"><PuzzleIcon size={12} /> Today's Puzzle</p>
                <h4 className="text-sm text-ink-100 font-medium mt-1 truncate">{data?.featuredPuzzle?.title ?? 'No puzzles yet'}</h4>
                <Link to="/student/puzzles" className="text-xs text-gold-400 hover:text-gold-300 mt-1.5 inline-block">Solve now →</Link>
              </div>
            </Card>
          </motion.div>
        </div>

        {data?.announcement && (
          <motion.div variants={item}>
            <Card className="p-4 flex items-center gap-3 bg-navy-800/40">
              <Megaphone size={16} className="text-gold-400 shrink-0" />
              <p className="text-sm text-ink-300"><span className="text-ink-100 font-medium">{data.announcement.title}.</span> {data.announcement.body}</p>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </StudentLayout>
  );
}
