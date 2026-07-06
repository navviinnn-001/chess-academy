import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import StudentLayout from '@/components/layout/StudentLayout';
import Card, { CardHeader } from '@/components/ui/Card';
import ProgressRing from '@/components/ui/ProgressRing';
import ProgressBar from '@/components/ui/ProgressBar';
import Skeleton from '@/components/ui/Skeleton';
import { api } from '@/lib/api';

interface ProgressDto {
  stats: { attendancePct: number; learningPct: number; puzzlePct: number };
  weeklyUpdates: { _id: string; week: string; rating: number }[];
}

export default function MyProgress() {
  const [data, setData] = useState<ProgressDto | null>(null);

  useEffect(() => {
    api.get<ProgressDto>('/me/progress').then(setData);
  }, []);

  if (!data) {
    return <StudentLayout title="My Progress"><Skeleton className="h-96 w-full" /></StudentLayout>;
  }

  const trend = [...data.weeklyUpdates].reverse().map(u => ({ week: u.week.replace('Week of ', ''), pct: u.rating * 20 }));

  return (
    <StudentLayout title="My Progress">
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 flex flex-col items-center text-center">
          <ProgressRing value={data.stats.attendancePct} size={100} label="Attendance" />
          <p className="text-xs text-ink-500 mt-4">Based on completed classes so far</p>
        </Card>
        <Card className="p-6 flex flex-col items-center text-center">
          <ProgressRing value={data.stats.learningPct} size={100} color="#D4AF6A" label="Learning" />
          <p className="text-xs text-ink-500 mt-4">Of all published learning resources</p>
        </Card>
        <Card className="p-6 flex flex-col items-center text-center">
          <ProgressRing value={data.stats.puzzlePct} size={100} color="#3FCBA6" label="Puzzles" />
          <p className="text-xs text-ink-500 mt-4">Of all published puzzles</p>
        </Card>
      </div>

      {trend.length > 0 && (
        <Card className="mb-6">
          <CardHeader title="Coach Rating Trend" subtitle="From your weekly updates" />
          <div className="px-3 pb-5 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3FCBA6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3FCBA6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#71799A" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#0F1730', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="pct" stroke="#3FCBA6" strokeWidth={2} fill="url(#attendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader title="Weekly Update History" />
        <div className="px-5 pb-5 space-y-4">
          {data.weeklyUpdates.length === 0 && <p className="text-sm text-ink-500">No weekly updates yet.</p>}
          {data.weeklyUpdates.map(u => (
            <motion.div key={u._id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-4">
              <div className="w-24 shrink-0 text-xs text-ink-400 coord-label">{u.week}</div>
              <ProgressBar value={u.rating * 20} color="bg-gold-500" className="flex-1" />
              <span className="text-xs text-ink-500 w-10 text-right">{u.rating}/5</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </StudentLayout>
  );
}
