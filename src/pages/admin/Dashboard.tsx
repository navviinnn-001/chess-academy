import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserX, Wallet, ClipboardList,
  UserPlus, Video, PuzzleIcon, BookOpen, PenLine, ArrowRight, Sparkles,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import StatCard from '@/components/ui/StatCard';
import AnimatedSection, { AnimatedItem } from '@/components/ui/AnimatedSection';
import { MoveArrow } from '@/components/ui/ChessMotifs';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();
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
    { label: 'Active students', value: summary.totalActive, icon: <Users size={18} />, tone: 'emerald' as const },
    { label: 'Inactive students', value: summary.totalInactive, icon: <UserX size={18} />, tone: 'neutral' as const },
    { label: 'Payments pending', value: summary.paymentPending, icon: <Wallet size={18} />, tone: 'gold' as const },
    { label: 'Missing weekly updates', value: summary.missingUpdates, icon: <ClipboardList size={18} />, tone: 'neutral' as const },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Operations overview">
      <AnimatedSection className="space-y-6">
        {/* Cinematic welcome hero */}
        <AnimatedItem>
          <Card className="relative overflow-hidden p-7 md:p-9 border-gold-500/12">
            <MoveArrow className="absolute -top-2 -right-6 w-56 opacity-30" color="#B08D4F" />
            <div className="relative flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-gold-400" />
              <span className="coord-label text-xs text-gold-400">Academy Command Center</span>
            </div>
            <h2 className="editorial-heading text-2xl md:text-3xl text-ink-100 relative">
              Welcome back, {user?.name?.split(' ')[0] ?? 'Coach'}.
            </h2>
            <p className="text-sm text-ink-400 mt-2 max-w-lg relative">
              Here's the state of the academy today — students, classes, and coaching work that
              needs your attention.
            </p>
          </Card>
        </AnimatedItem>

        {/* KPI grid */}
        <AnimatedItem className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(s => <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} tone={s.tone} />)}
        </AnimatedItem>

        <AnimatedItem>
          <Card className="p-5">
            <p className="text-xs text-ink-500 mb-4 coord-label">Quick Actions</p>
            <div className="flex flex-wrap gap-3">
              {quickActions.map(a => (
                <Link key={a.label} to={a.to}>
                  <Button variant="outline" size="sm" icon={<a.icon size={14} />}>{a.label}</Button>
                </Link>
              ))}
            </div>
          </Card>
        </AnimatedItem>

        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatedItem>
            <Card hover className="h-full">
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
          </AnimatedItem>

          <AnimatedItem>
            <Card hover className="h-full">
              <CardHeader title="Students Missing Weekly Updates" subtitle={`${missing.length} students`} action={<Link to="/admin/weekly-updates"><Button size="sm" variant="outline">Write updates</Button></Link>} />
              <div className="px-5 pb-5 divide-y divide-white/6 max-h-64 overflow-y-auto">
                {missing.length === 0 && <p className="text-sm text-ink-500 py-3">All students are up to date this week.</p>}
                {missing.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-navy-700 flex items-center justify-center text-xs text-ink-300">{s.name.split(' ').map(p => p[0]).join('')}</div>
                      <span className="text-sm text-ink-200">{s.name}</span>
                    </div>
                    <Badge tone="gold">Pending</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedItem>
        </div>
      </AnimatedSection>
    </AdminLayout>
  );
}