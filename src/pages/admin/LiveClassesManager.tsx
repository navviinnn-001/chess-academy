import { useEffect, useState } from 'react';
import { Plus, CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import { Drawer, Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { ApiClientError } from '@/context/AuthContext';
import type { AttendanceMark } from '@/types';

interface StudentOption { id: string; name: string }
interface ClassDto {
  _id: string; topic: string; dateTime: string; instructions: string; published: boolean;
  status: 'upcoming' | 'completed'; meetingLink?: string; recordingLink?: string;
}

export default function LiveClassesManager() {
  const [classes, setClasses] = useState<ClassDto[] | null>(null);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [attendanceModal, setAttendanceModal] = useState<string | null>(null);
  const [marks, setMarks] = useState<Record<string, AttendanceMark>>({});
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ topic: '', date: '', time: '', meetingLink: '', instructions: '', homework: '' });
  const { push } = useToast();

  const load = () => api.get<{ classes: ClassDto[] }>('/live-classes').then(r => setClasses(r.classes));
  useEffect(() => { load(); api.get<{ students: StudentOption[] }>('/students').then(r => setStudents(r.students)); }, []);

  const list = (classes ?? []).filter(c => tab === 'upcoming' ? c.status !== 'completed' : c.status === 'completed');

  const togglePublish = async (c: ClassDto) => {
    await api.patch(`/live-classes/${c._id}`, { published: !c.published });
    load();
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await api.post('/live-classes', {
        topic: form.topic,
        dateTime: new Date(`${form.date}T${form.time || '00:00'}`).toISOString(),
        meetingLink: form.meetingLink,
        instructions: form.instructions,
        homework: form.homework,
      });
      push('Class created as draft.');
      setDrawerOpen(false);
      setForm({ topic: '', date: '', time: '', meetingLink: '', instructions: '', homework: '' });
      load();
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Could not create class.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAttendance = async () => {
    if (!attendanceModal) return;
    const payload = Object.entries(marks).map(([student, mark]) => ({ student, mark }));
    await api.post(`/live-classes/${attendanceModal}/attendance`, { marks: payload });
    push('Attendance saved.');
    setAttendanceModal(null);
    setMarks({});
    load();
  };

  return (
    <AdminLayout title="Live Classes" subtitle="Schedule, publish and mark attendance" actions={<Button icon={<Plus size={15} />} onClick={() => setDrawerOpen(true)}>Add Class</Button>}>
      <div className="flex gap-2 mb-6">
        {(['upcoming', 'past'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm capitalize ${tab === t ? 'bg-gold-500/12 text-gold-300' : 'text-ink-400 hover:bg-white/5'}`}>{t}</button>
        ))}
      </div>

      {!classes ? <Skeleton className="h-64 w-full" /> : (
        <div className="space-y-4">
          {list.map(c => (
            <Card key={c._id} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge tone={c.published ? 'success' : 'neutral'} dot>{c.published ? 'Published' : 'Draft'}</Badge>
                    <span className="text-xs text-ink-500 coord-label">{new Date(c.dateTime).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                  <h3 className="font-display text-base text-ink-100">{c.topic}</h3>
                  <p className="text-xs text-ink-400 mt-1">{c.instructions}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {tab === 'past' && <Button size="sm" variant="outline" onClick={() => setAttendanceModal(c._id)}>Mark Attendance</Button>}
                  <Button size="sm" variant={c.published ? 'ghost' : 'primary'} onClick={() => togglePublish(c)}>{c.published ? 'Unpublish' : 'Publish'}</Button>
                </div>
              </div>
            </Card>
          ))}
          {list.length === 0 && <Card className="p-8 text-center text-sm text-ink-500">No classes in this view yet.</Card>}
        </div>
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Class"
        footer={<><Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving || !form.topic || !form.date}>{saving ? 'Creating…' : 'Create Class'}</Button></>}>
        <div className="space-y-4">
          <Input label="Topic" placeholder="e.g. Knight Outposts" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Input label="Time" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
          </div>
          <Input label="Meeting link" placeholder="https://meet.google.com/…" value={form.meetingLink} onChange={e => setForm({ ...form, meetingLink: e.target.value })} />
          <Input label="Instructions" placeholder="Notes shown to students" value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} />
          <Input label="Homework (optional)" placeholder="Task for after class" value={form.homework} onChange={e => setForm({ ...form, homework: e.target.value })} />
        </div>
      </Drawer>

      <Modal open={!!attendanceModal} onClose={() => setAttendanceModal(null)} title="Mark Attendance"
        footer={<Button onClick={handleSaveAttendance}>Save Attendance</Button>}>
        <div className="space-y-2">
          {students.map(s => (
            <div key={s.id} className="flex items-center justify-between p-2.5 rounded-md hover:bg-white/5">
              <span className="text-sm text-ink-200">{s.name}</span>
              <div className="flex gap-1.5">
                {(['Present', 'Late', 'Absent'] as AttendanceMark[]).map(m => (
                  <button
                    key={m} onClick={() => setMarks(prev => ({ ...prev, [s.id]: m }))}
                    className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1 border ${marks[s.id] === m
                      ? m === 'Present' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : m === 'Late' ? 'bg-warning/15 text-warning border-warning/30'
                      : 'bg-danger/15 text-danger border-danger/30'
                      : 'border-white/10 text-ink-500'}`}
                  >
                    {m === 'Present' && <CheckCircle2 size={12} />}
                    {m === 'Late' && <Clock3 size={12} />}
                    {m === 'Absent' && <XCircle size={12} />}
                    {m}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </AdminLayout>
  );
}
