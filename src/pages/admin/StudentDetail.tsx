import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressRing from '@/components/ui/ProgressRing';
import Skeleton from '@/components/ui/Skeleton';
import { api } from '@/lib/api';

const tabs = ['Overview', 'Attendance', 'Payments', 'Weekly Updates', 'Private Notes', 'Activity'] as const;

interface DetailDto {
  student: {
    id: string; name: string; avatarInitials: string; age?: number; language?: string;
    status: string; joinedOn: string; contact?: string; email?: string;
    attendancePct: number; learningPct: number; puzzlePct: number; lastUpdateWeek: string | null;
  };
  payments: { _id: string; month: string; fee: number; amountReceived: number; status: string }[];
  weeklyUpdates: { _id: string; week: string; strengths: string }[];
  notes: { _id: string; createdAt: string; content: string }[];
}

export default function StudentDetail() {
  const { id } = useParams();
  const [data, setData] = useState<DetailDto | null>(null);
  const [tab, setTab] = useState<typeof tabs[number]>('Overview');

  useEffect(() => {
    if (!id) return;
    api.get<DetailDto>(`/students/${id}`).then(setData);
  }, [id]);

  if (!data) {
    return <AdminLayout title="Student" subtitle="Loading…"><Skeleton className="h-96 w-full" /></AdminLayout>;
  }

  const { student, payments, weeklyUpdates, notes } = data;

  return (
    <AdminLayout title={student.name} subtitle="Student profile">
      <Link to="/admin/students" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100 mb-6">
        <ArrowLeft size={15} /> Back to students
      </Link>

      <div className="grid lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 text-center lg:col-span-1">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 text-xl font-display mx-auto mb-3">
            {student.avatarInitials}
          </div>
          <h3 className="font-display text-lg text-ink-100">{student.name}</h3>
          <p className="text-xs text-ink-500 mt-1">Age {student.age} · {student.language}</p>
          <div className="mt-3"><Badge tone={student.status === 'active' ? 'success' : 'neutral'} dot>{student.status === 'active' ? 'Approved' : 'Inactive'}</Badge></div>
        </Card>
        <div className="lg:col-span-3 grid grid-cols-3 gap-4">
          <Card className="p-5 flex flex-col items-center"><ProgressRing value={student.attendancePct} size={70} label="Attend." /></Card>
          <Card className="p-5 flex flex-col items-center"><ProgressRing value={student.learningPct} size={70} color="#D4AF6A" label="Learning" /></Card>
          <Card className="p-5 flex flex-col items-center"><ProgressRing value={student.puzzlePct} size={70} color="#3FCBA6" label="Puzzles" /></Card>
        </div>
      </div>

      <div className="flex gap-1 mb-5 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3.5 py-2 rounded-md text-sm whitespace-nowrap ${tab === t ? 'bg-gold-500/12 text-gold-300' : 'text-ink-400 hover:bg-white/5'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <Card className="p-6">
          <p className="text-sm text-ink-300">Contact: {student.contact ?? '—'}</p>
          <p className="text-sm text-ink-300 mt-2">Email: {student.email ?? '—'}</p>
          <p className="text-sm text-ink-300 mt-2">Joined: {new Date(student.joinedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="text-sm text-ink-300 mt-2">Last weekly update: {student.lastUpdateWeek ?? 'None yet'}</p>
        </Card>
      )}

      {tab === 'Attendance' && (
        <Card className="p-6"><p className="text-sm text-ink-300">Attendance rate: <span className="text-ink-100 font-medium">{student.attendancePct}%</span> across completed classes.</p></Card>
      )}

      {tab === 'Payments' && (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-ink-500 border-b border-white/8"><th className="px-5 py-3">Month</th><th className="px-5 py-3">Fee</th><th className="px-5 py-3">Received</th><th className="px-5 py-3">Status</th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id} className="border-b border-white/6 last:border-0"><td className="px-5 py-3 text-ink-200">{p.month}</td><td className="px-5 py-3 text-ink-300">₹{p.fee}</td><td className="px-5 py-3 text-ink-300">₹{p.amountReceived}</td><td className="px-5 py-3"><Badge tone={p.status === 'Paid' ? 'success' : p.status === 'Partial' ? 'warning' : 'danger'}>{p.status}</Badge></td></tr>
              ))}
              {payments.length === 0 && <tr><td colSpan={4} className="px-5 py-6 text-center text-ink-500">No payments recorded.</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'Weekly Updates' && (
        <div className="space-y-4">
          {weeklyUpdates.length ? weeklyUpdates.map(u => (
            <Card key={u._id} className="p-5">
              <p className="text-sm text-ink-100 font-medium">{u.week}</p>
              <p className="text-sm text-ink-400 mt-1.5">{u.strengths}</p>
            </Card>
          )) : <Card className="p-6"><p className="text-sm text-ink-500">No weekly updates written yet.</p></Card>}
        </div>
      )}

      {tab === 'Private Notes' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-ink-500 mb-2"><Lock size={12} /> Visible to admin only</div>
          {notes.length ? notes.map(n => (
            <Card key={n._id} className="p-5">
              <p className="text-xs text-ink-500 mb-1.5">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p className="text-sm text-ink-300">{n.content}</p>
            </Card>
          )) : <Card className="p-6"><p className="text-sm text-ink-500">No private notes for this student.</p></Card>}
        </div>
      )}

      {tab === 'Activity' && (
        <Card className="p-6"><p className="text-sm text-ink-500">Activity log coming soon — logins, submissions, and portal actions will appear here.</p></Card>
      )}
    </AdminLayout>
  );
}
