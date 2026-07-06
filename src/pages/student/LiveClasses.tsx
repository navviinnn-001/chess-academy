import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Lock, FileDown, PlayCircle, ClipboardCheck } from 'lucide-react';
import StudentLayout from '@/components/layout/StudentLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { useCountdown } from '@/hooks/useCountdown';
import { api } from '@/lib/api';

interface LiveClassDto {
  _id: string;
  topic: string;
  dateTime: string;
  instructions: string;
  homework?: string;
  meetingLink?: string;
  recordingLink?: string;
  status: 'upcoming' | 'completed';
}

function ClassCard({ cls }: { cls: LiveClassDto }) {
  const countdown = useCountdown(cls.dateTime);
  const isUpcoming = cls.status !== 'completed';
  const dominant = isUpcoming && countdown.isSoon;

  return (
    <Card hover className={`p-5 md:p-6 ${dominant ? 'border-emerald-500/30' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge tone={dominant ? 'success' : isUpcoming ? 'gold' : 'neutral'} dot>
              {dominant ? 'Starting soon' : isUpcoming ? 'Upcoming' : 'Completed'}
            </Badge>
            {isUpcoming && <span className="text-xs text-ink-500 coord-label">{new Date(cls.dateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
          </div>
          <h3 className="font-display text-lg text-ink-100">{cls.topic}</h3>
          <p className="text-sm text-ink-400 mt-1.5">{cls.instructions}</p>
          {cls.homework && (
            <p className="text-xs text-ink-500 mt-2 flex items-center gap-1.5"><ClipboardCheck size={12} /> Homework: {cls.homework}</p>
          )}
          {isUpcoming && (
            <div className="flex gap-1.5 mt-3 coord-label text-[11px] text-ink-400">
              {countdown.days > 0 && <span>{countdown.days}d</span>}
              <span>{String(countdown.hours).padStart(2, '0')}h</span>
              <span>{String(countdown.minutes).padStart(2, '0')}m</span>
              <span>{String(countdown.seconds).padStart(2, '0')}s</span>
              <span className="text-ink-600">to start</span>
            </div>
          )}
        </div>

        <div className="shrink-0">
          {cls.status === 'completed' && cls.recordingLink && (
            <a href={cls.recordingLink} target="_blank" rel="noreferrer"><Button variant="outline" icon={<PlayCircle size={16} />}>Watch Recording</Button></a>
          )}
          {isUpcoming && dominant && cls.meetingLink && (
            <a href={cls.meetingLink} target="_blank" rel="noreferrer"><Button variant="primary" icon={<Video size={16} />} className="animate-pulseRing">Join Class</Button></a>
          )}
          {isUpcoming && !dominant && (
            <Button variant="ghost" icon={<Lock size={16} />} disabled>Link opens soon</Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function LiveClasses() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [classes, setClasses] = useState<LiveClassDto[] | null>(null);

  useEffect(() => {
    api.get<{ classes: LiveClassDto[] }>('/live-classes').then(r => setClasses(r.classes));
  }, []);

  if (!classes) {
    return (
      <StudentLayout title="Live Classes">
        <div className="space-y-4"><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></div>
      </StudentLayout>
    );
  }

  const upcoming = classes.filter(c => c.status !== 'completed');
  const past = classes.filter(c => c.status === 'completed');

  return (
    <StudentLayout title="Live Classes">
      <div className="flex gap-2 mb-6">
        {(['upcoming', 'past'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm capitalize transition-colors ${tab === t ? 'bg-emerald-500/12 text-emerald-300' : 'text-ink-400 hover:bg-white/5'}`}
          >
            {t === 'upcoming' ? 'Upcoming' : 'Recordings'}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
        {tab === 'upcoming' && (
          upcoming.length ? upcoming.map(c => <ClassCard key={c._id} cls={c} />) : (
            <Card><EmptyState icon={<Video size={22} />} title="No upcoming classes" description="Your coach hasn't scheduled the next class yet. Check back soon." /></Card>
          )
        )}
        {tab === 'past' && (
          past.length ? past.map(c => <ClassCard key={c._id} cls={c} />) : (
            <Card><EmptyState icon={<FileDown size={22} />} title="No recordings yet" description="Completed class recordings will appear here." /></Card>
          )
        )}
      </motion.div>
    </StudentLayout>
  );
}
