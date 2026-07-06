import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ClipboardList } from 'lucide-react';
import StudentLayout from '@/components/layout/StudentLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { api } from '@/lib/api';

interface WeeklyUpdateDto {
  _id: string;
  week: string;
  attendance: string;
  topicsCovered: string[];
  strengths: string;
  improvementArea: string;
  nextTask: string;
  rating: number;
}

export default function WeeklyUpdates() {
  const [updates, setUpdates] = useState<WeeklyUpdateDto[] | null>(null);

  useEffect(() => {
    api.get<{ updates: WeeklyUpdateDto[] }>('/weekly-updates').then(r => setUpdates(r.updates));
  }, []);

  if (!updates) {
    return <StudentLayout title="Weekly Updates"><div className="space-y-4"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div></StudentLayout>;
  }

  return (
    <StudentLayout title="Weekly Updates">
      {updates.length === 0 ? (
        <Card><EmptyState icon={<ClipboardList size={22} />} title="No updates yet" description="Your coach will publish your first weekly update soon." /></Card>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
          {updates.map((u, i) => (
            <motion.div key={u._id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }} className="relative">
              <span className={`absolute -left-6 top-2 h-3.5 w-3.5 rounded-full border-2 ${i === 0 ? 'bg-emerald-400 border-emerald-300' : 'bg-navy-800 border-white/20'}`} />
              <Card className={i === 0 ? 'p-6 border-emerald-500/25' : 'p-6'} hover>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg text-ink-100">{u.week}</h3>
                    {i === 0 && <Badge tone="success" dot>Latest</Badge>}
                  </div>
                  <div className="flex gap-0.5 text-gold-400">
                    {Array.from({ length: 5 }).map((_, idx) => <Star key={idx} size={13} fill={idx < u.rating ? 'currentColor' : 'none'} className={idx < u.rating ? '' : 'text-ink-600'} />)}
                  </div>
                </div>
                <p className="text-xs text-ink-500 mb-3">Attendance: {u.attendance}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-ink-500 text-xs mb-1">Strengths</p>
                    <p className="text-ink-300 leading-relaxed">{u.strengths}</p>
                  </div>
                  <div>
                    <p className="text-ink-500 text-xs mb-1">Improvement area</p>
                    <p className="text-ink-300 leading-relaxed">{u.improvementArea}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/8 flex flex-wrap gap-2">
                  {u.topicsCovered.map(t => <Badge key={t} tone="info">{t}</Badge>)}
                </div>
                <p className="text-xs text-ink-500 mt-4"><span className="text-gold-400">Next task — </span>{u.nextTask}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
}
