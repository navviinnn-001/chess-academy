import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, UserX, Wallet, ClipboardList,
  UserPlus, Video, PuzzleIcon, BookOpen, PenLine, ArrowRight,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { api } from '@/lib/api';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 0.9, 0.3, 1] } } };

interface SummaryDto {
  totalActive: number;
  totalInactive: number;
  paymentPending: number;
  missingUpdates: number;
  nextClass: { topic: string; dateTime: string } | null;
}

interface MissingUpdateStudent { id: string; name: string; hasUpdateThisWeek: boolean }

const quickActions = [
  { label: 'Add Student', icon: UserPlus, to: '/admin/students' },
  { label: 'Add Class', icon: Video, to: '/admin/live-classes' },
  { label: 'Upload Puzzle', icon: PuzzleIcon, to: '/admin/puzzles' },
  { label: 'Add Content', icon: BookOpen, to: '/admin/learning-content' },
  { label: 'Write Update', icon: PenLine, to: '/admin/weekly-updates' },
];

export default function AdminDashboard() {
  const [summary, setSummary] = useState<SummaryDto | null>(null);
  const [missing, setMissing] = useState<MissingUpdateStudent[]>([]);

  useEffect(() => {
    api.get<SummaryDto>('/admin/summary').then(setSummary);
    api.get<{ students: MissingUpdateStudent[] }>('/weekly-updates/missing').then(r => setMissing(r.students));
  }, []);

  if (!summary) {
    return (
      <AdminLayout title="Dashboard" subtitle="Operations overview">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>
      </AdminLayout>
    );
  }

  const stats = [
    { label: 'Active students', value: summary.totalActive, icon: Users, tone: 'success' as const },
    { label: 'Inactive students', value: summary.totalInactive, icon: UserX, tone: 'neutral' as const },
    { label: 'Payments pending', value: summary.paymentPending, icon: Wallet, tone: 'warning' as const },
    { label: 'Missing weekly updates', value: summary.missingUpdates, icon: ClipboardList, tone: 'danger' as const },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Operations overview">
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={item} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(s => (
            <Card key={s.label} hover className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center">
                  <s.icon size={18} className="text-ink-300" />
                </div>
                {s.value > 0 && s.tone !== 'success' && <Badge tone={s.tone}>Action</Badge>}
              </div>
              <p className="font-display text-3xl text-ink-100">{s.value}</p>
              <p className="text-xs text-ink-500 mt-1">{s.label}</p>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-5">
            <p className="text-xs text-ink-500 mb-4">Quick Actions</p>
            <div className="flex flex-wrap gap-3">
              {quickActions.map(a => (
                <Link key={a.label} to={a.to}>
                  <Button variant="outline" size="sm" icon={<a.icon size={14} />}>{a.label}</Button>
                </Link>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader title="Upcoming Class" />
            <div className="px-5 pb-5">
              {summary.nextClass ? (
                <>
                  <p className="text-sm text-ink-100 font-medium">{summary.nextClass.topic}</p>
                  <p className="text-xs text-ink-500 mt-1">{new Date(summary.nextClass.dateTime).toLocaleString('en-IN', { weekday: 'long', hour: 'numeric', minute: '2-digit' })}</p>
                  <Link to="/admin/live-classes"><Button size="sm" variant="ghost" className="mt-4 px-0" iconRight={<ArrowRight size={13} />}>Manage classes</Button></Link>
                </>
              ) : <p className="text-sm text-ink-500">No class scheduled.</p>}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader title="Students Missing Weekly Updates" subtitle={`${missing.length} students`} action={<Link to="/admin/weekly-updates"><Button size="sm" variant="outline">Write updates</Button></Link>} />
            <div className="px-5 pb-5 divide-y divide-white/6">
              {missing.length === 0 && <p className="text-sm text-ink-500 py-3">All students are up to date this week.</p>}
              {missing.map(s => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-navy-700 flex items-center justify-center text-xs text-ink-300">{s.name.split(' ').map(p => p[0]).join('')}</div>
                    <span className="text-sm text-ink-200">{s.name}</span>
                  </div>
                  <Badge tone="warning">Pending</Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
