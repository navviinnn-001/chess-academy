import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, KeyRound, Power } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import { Drawer, Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { ApiClientError } from '@/context/AuthContext';
import type { AccountStatus } from '@/types';

interface StudentDto {
  id: string; name: string; avatarInitials: string; age?: number; language?: string;
  status: AccountStatus; joinedOn: string; contact?: string; email?: string;
  attendancePct: number; paymentStatus: 'Paid' | 'Pending' | 'Partial';
}

export default function StudentManagement() {
  const [students, setStudents] = useState<StudentDto[] | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All' | AccountStatus>('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; action: 'toggle' | 'reset' } | null>(null);
  const [form, setForm] = useState({ name: '', age: '', language: 'English', contact: '', email: '' });
  const [creating, setCreating] = useState(false);
  const [tempPasswordInfo, setTempPasswordInfo] = useState<{ name: string; tempPassword: string } | null>(null);
  const { push } = useToast();

  const load = () => api.get<{ students: StudentDto[] }>('/students').then(r => setStudents(r.students));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => (students ?? []).filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) && (status === 'All' || s.status === status),
  ), [students, query, status]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await api.post<{ student: { name: string }; tempPassword: string; message: string }>('/students', {
        name: form.name,
        age: Number(form.age),
        language: form.language,
        contact: form.contact,
        email: form.email || undefined,
      });
      setDrawerOpen(false);
      setForm({ name: '', age: '', language: 'English', contact: '', email: '' });
      setTempPasswordInfo({ name: res.student.name, tempPassword: res.tempPassword });
      load();
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Could not create student.', 'warning');
    } finally {
      setCreating(false);
    }
  };

  const confirmAction = async () => {
    if (!confirmTarget) return;
    try {
      if (confirmTarget.action === 'toggle') {
        await api.patch(`/students/${confirmTarget.id}/status`);
        push('Student status updated.');
        load();
      } else {
        const res = await api.post<{ tempPassword: string }>(`/students/${confirmTarget.id}/reset-password`);
        const s = students?.find(x => x.id === confirmTarget.id);
        setTempPasswordInfo({ name: s?.name ?? 'Student', tempPassword: res.tempPassword });
      }
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Action failed.', 'warning');
    } finally {
      setConfirmTarget(null);
    }
  };

  return (
    <AdminLayout title="Students" subtitle={`${students?.length ?? 0} total students`} actions={
      <Button icon={<UserPlus size={15} />} onClick={() => setDrawerOpen(true)}>Add Student</Button>
    }>
      <Card className="mb-5 p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search students…"
            className="w-full bg-navy-800 border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
        </div>
        <Select options={[{ label: 'All statuses', value: 'All' }, { label: 'Approved', value: 'active' }, { label: 'Inactive', value: 'inactive' }]}
          value={status} onChange={e => setStatus(e.target.value as any)} className="md:w-48" />
      </Card>

      {!students ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-500 border-b border-white/8">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Attendance</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-white/6 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5">
                      <Link to={`/admin/students/${s.id}`} className="flex items-center gap-3 group">
                        <div className="h-8 w-8 rounded-full bg-navy-700 flex items-center justify-center text-xs text-ink-300 shrink-0">{s.avatarInitials}</div>
                        <div>
                          <p className="text-ink-100 group-hover:text-emerald-300 transition-colors">{s.name}</p>
                          <p className="text-xs text-ink-500">Age {s.age} · {s.language}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5"><Badge tone={s.status === 'active' ? 'success' : 'neutral'} dot>{s.status === 'active' ? 'Approved' : 'Inactive'}</Badge></td>
                    <td className="px-5 py-3.5 text-ink-300">{s.attendancePct}%</td>
                    <td className="px-5 py-3.5"><Badge tone={s.paymentStatus === 'Paid' ? 'success' : s.paymentStatus === 'Partial' ? 'warning' : 'danger'}>{s.paymentStatus}</Badge></td>
                    <td className="px-5 py-3.5 text-ink-400 text-xs coord-label">{new Date(s.joinedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button title="Reset password" onClick={() => setConfirmTarget({ id: s.id, action: 'reset' })} className="p-1.5 rounded-md text-ink-500 hover:text-ink-100 hover:bg-white/5"><KeyRound size={15} /></button>
                        <button title="Toggle status" onClick={() => setConfirmTarget({ id: s.id, action: 'toggle' })} className="p-1.5 rounded-md text-ink-500 hover:text-ink-100 hover:bg-white/5"><Power size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-ink-500">No students match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Student"
        footer={<><Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={creating || !form.name || !form.age || !form.contact}>{creating ? 'Creating…' : 'Create Student'}</Button></>}>
        <div className="space-y-4">
          <Input label="Full name" placeholder="Student's full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Age" type="number" placeholder="e.g. 10" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
          <Select label="Language preference" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}
            options={[{ label: 'English', value: 'English' }, { label: 'Malayalam', value: 'Malayalam' }]} />
          <Input label="WhatsApp contact number" placeholder="+91…" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
          <Input label="Registered email (optional)" placeholder="Optional, for login" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
      </Drawer>

      <Modal open={!!confirmTarget} onClose={() => setConfirmTarget(null)}
        title={confirmTarget?.action === 'toggle' ? 'Change student status' : 'Reset password'}
        footer={<><Button variant="ghost" onClick={() => setConfirmTarget(null)}>Cancel</Button><Button variant={confirmTarget?.action === 'toggle' ? 'danger' : 'primary'} onClick={confirmAction}>Confirm</Button></>}>
        <p className="text-sm text-ink-300">
          {confirmTarget?.action === 'toggle'
            ? "This will change the student's portal access immediately. Continue?"
            : 'A new temporary password will be generated. You\'ll need to share it with the student on WhatsApp. Continue?'}
        </p>
      </Modal>

      <Modal open={!!tempPasswordInfo} onClose={() => setTempPasswordInfo(null)} title="Temporary password generated"
        footer={<Button onClick={() => setTempPasswordInfo(null)}>Done</Button>}>
        <p className="text-sm text-ink-300 mb-4">
          Share this temporary password with <span className="text-ink-100 font-medium">{tempPasswordInfo?.name}</span> on WhatsApp.
          They'll be asked to set their own password on first login.
        </p>
        <div className="rounded-md bg-navy-950 border border-gold-500/25 px-4 py-3 font-mono text-gold-300 text-center text-lg tracking-wide">
          {tempPasswordInfo?.tempPassword}
        </div>
      </Modal>
    </AdminLayout>
  );
}
