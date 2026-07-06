import { useEffect, useState } from 'react';
import { Eye, PenLine, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { ApiClientError } from '@/context/AuthContext';

interface StudentOption { id: string; name: string }
interface MissingStudent { id: string; name: string }

export default function WeeklyUpdatesManager() {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [missing, setMissing] = useState<MissingStudent[]>([]);
  const [form, setForm] = useState({ student: '', week: '', attendance: '', topics: '', strengths: '', improvement: '', nextTask: '', rating: '4' });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  const loadMissing = () => api.get<{ students: MissingStudent[] }>('/weekly-updates/missing').then(r => setMissing(r.students));

  useEffect(() => {
    api.get<{ students: StudentOption[] }>('/students').then(r => { setStudents(r.students); if (r.students[0]) setForm(f => ({ ...f, student: r.students[0].id })); });
    loadMissing();
  }, []);

  const handlePublish = async () => {
    setSaving(true);
    try {
      await api.post('/weekly-updates', {
        student: form.student,
        week: form.week,
        attendance: form.attendance,
        topicsCovered: form.topics.split(',').map(t => t.trim()).filter(Boolean),
        strengths: form.strengths,
        improvementArea: form.improvement,
        nextTask: form.nextTask,
        rating: Number(form.rating),
      });
      push('Weekly update published to student.');
      setForm(f => ({ ...f, week: '', attendance: '', topics: '', strengths: '', improvement: '', nextTask: '' }));
      loadMissing();
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Could not publish update.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Weekly Updates" subtitle="Write coach feedback for students">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="New Weekly Update" />
            <div className="px-5 pb-6 space-y-4">
              <Select label="Student" value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} options={students.map(s => ({ label: s.name, value: s.id }))} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Week" placeholder="Week of 29 Jun" value={form.week} onChange={e => setForm({ ...form, week: e.target.value })} />
                <Input label="Attendance" placeholder="3/3 classes" value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })} />
              </div>
              <Input label="Topics covered" placeholder="Comma-separated, e.g. Rook endgames, King activity" value={form.topics} onChange={e => setForm({ ...form, topics: e.target.value })} />
              <div>
                <label className="block text-sm text-ink-300 mb-1.5">Strengths</label>
                <textarea rows={3} value={form.strengths} onChange={e => setForm({ ...form, strengths: e.target.value })} className="w-full bg-navy-800 border border-white/10 rounded-md p-3.5 text-sm text-ink-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
              </div>
              <div>
                <label className="block text-sm text-ink-300 mb-1.5">Improvement area</label>
                <textarea rows={3} value={form.improvement} onChange={e => setForm({ ...form, improvement: e.target.value })} className="w-full bg-navy-800 border border-white/10 rounded-md p-3.5 text-sm text-ink-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
              </div>
              <Input label="Next practice task" value={form.nextTask} onChange={e => setForm({ ...form, nextTask: e.target.value })} />
              <Select label="Rating (optional)" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} options={['1', '2', '3', '4', '5'].map(v => ({ label: `${v} / 5`, value: v }))} />

              <div className="flex gap-3 pt-2">
                <Button variant="outline" icon={<Eye size={15} />} onClick={() => setPreviewOpen(true)}>Preview</Button>
                <Button icon={<PenLine size={15} />} onClick={handlePublish} disabled={saving || !form.student || !form.week}>{saving ? 'Publishing…' : 'Publish Update'}</Button>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Missing This Week" subtitle={`${missing.length} students`} />
          <div className="px-5 pb-5 space-y-2">
            {missing.map(s => (
              <div key={s.id} className="flex items-center justify-between p-2.5 rounded-md hover:bg-white/5">
                <span className="text-sm text-ink-200">{s.name}</span>
                <Badge tone="warning" dot><AlertCircle size={11} className="mr-0.5" />Pending</Badge>
              </div>
            ))}
            {missing.length === 0 && <p className="text-sm text-ink-500">All students are up to date this week.</p>}
          </div>
        </Card>
      </div>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Student Preview">
        <Card className="p-5 border-emerald-500/25">
          <h3 className="font-display text-lg text-ink-100">{form.week || 'Week of —'}</h3>
          <p className="text-xs text-ink-500 mb-3">Attendance: {form.attendance || '—'}</p>
          <p className="text-sm text-ink-300"><span className="text-ink-500">Strengths — </span>{form.strengths || 'Not written yet'}</p>
          <p className="text-sm text-ink-300 mt-2"><span className="text-ink-500">Focus area — </span>{form.improvement || 'Not written yet'}</p>
          <p className="text-xs text-gold-400 mt-3">Next task — {form.nextTask || '—'}</p>
        </Card>
      </Modal>
    </AdminLayout>
  );
}
