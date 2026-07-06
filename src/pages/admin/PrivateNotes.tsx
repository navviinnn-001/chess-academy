import { useEffect, useMemo, useState } from 'react';
import { Plus, Pin, Lock, Search } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import { Drawer } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { ApiClientError } from '@/context/AuthContext';

interface StudentOption { id: string; name: string }
interface NoteDto { _id: string; student: { _id: string; name: string } | string; content: string; pinned: boolean; createdAt: string }

export default function PrivateNotes() {
  const [notes, setNotes] = useState<NoteDto[] | null>(null);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentFilter, setStudentFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ student: '', content: '' });
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  const load = () => {
    const params = studentFilter !== 'All' ? `?studentId=${studentFilter}` : '';
    api.get<{ notes: NoteDto[] }>(`/private-notes${params}`).then(r => setNotes(r.notes));
  };

  useEffect(() => { load(); }, [studentFilter]);
  useEffect(() => { api.get<{ students: StudentOption[] }>('/students').then(r => setStudents(r.students)); }, []);

  const filtered = useMemo(() => (notes ?? []).filter(n => n.content.toLowerCase().includes(query.toLowerCase())), [notes, query]);
  const studentName = (n: NoteDto) => (typeof n.student === 'string' ? students.find(s => s.id === n.student)?.name ?? '—' : n.student?.name ?? '—');

  const togglePin = async (id: string) => {
    await api.patch(`/private-notes/${id}/pin`);
    load();
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await api.post('/private-notes', form);
      push('Private note saved.');
      setDrawerOpen(false);
      setForm({ student: '', content: '' });
      load();
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Could not save note.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Private Notes" subtitle="Visible only to admin — never shown to students" actions={<Button icon={<Plus size={15} />} onClick={() => setDrawerOpen(true)}>Add Note</Button>}>
      <div className="flex items-center gap-2 mb-5 text-xs text-gold-400 bg-gold-500/8 border border-gold-500/20 rounded-md px-3.5 py-2.5 w-fit">
        <Lock size={13} /> These notes are private and never appear in the student portal.
      </div>

      <Card className="mb-5 p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search notes…"
            className="w-full bg-navy-800 border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
        </div>
        <Select options={[{ label: 'All students', value: 'All' }, ...students.map(s => ({ label: s.name, value: s.id }))]} value={studentFilter} onChange={e => setStudentFilter(e.target.value)} className="md:w-56" />
      </Card>

      {!notes ? <Skeleton className="h-64 w-full" /> : (
        <div className="space-y-3">
          {filtered.map(n => (
            <Card key={n._id} className={`p-5 ${n.pinned ? 'border-gold-500/30' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-sm text-ink-100 font-medium">{studentName(n)}</p>
                    <span className="text-xs text-ink-500 coord-label">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="text-sm text-ink-300 leading-relaxed">{n.content}</p>
                </div>
                <button onClick={() => togglePin(n._id)} className={`shrink-0 p-1.5 rounded-md ${n.pinned ? 'text-gold-400' : 'text-ink-500 hover:text-ink-200'}`}>
                  <Pin size={15} fill={n.pinned ? 'currentColor' : 'none'} />
                </button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <Card className="p-8 text-center text-sm text-ink-500">No private notes found.</Card>}
        </div>
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Private Note"
        footer={<><Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving || !form.student || !form.content}>{saving ? 'Saving…' : 'Save Note'}</Button></>}>
        <div className="space-y-4">
          <Select label="Student" value={form.student} onChange={e => setForm({ ...form, student: e.target.value })}
            options={[{ label: 'Select a student', value: '' }, ...students.map(s => ({ label: s.name, value: s.id }))]} />
          <div>
            <label className="block text-sm text-ink-300 mb-1.5">Note</label>
            <textarea rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write a private note about this student…" className="w-full bg-navy-800 border border-white/10 rounded-md p-3.5 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
        </div>
      </Drawer>
    </AdminLayout>
  );
}
