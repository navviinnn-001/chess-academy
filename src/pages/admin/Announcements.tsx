import { useEffect, useState } from 'react';
import { Plus, Megaphone, Archive } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import { Drawer } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { ApiClientError } from '@/context/AuthContext';

const priorityTone = { Normal: 'neutral', Important: 'gold', Urgent: 'danger' } as const;

interface AnnouncementDto {
  _id: string; title: string; body: string; publishDate: string;
  priority: 'Normal' | 'Important' | 'Urgent'; status: 'Published' | 'Archived';
}

export default function Announcements() {
  const [items, setItems] = useState<AnnouncementDto[] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', publishDate: '', priority: 'Normal' as 'Normal' | 'Important' | 'Urgent' });
  const { push } = useToast();

  const load = () => api.get<{ announcements: AnnouncementDto[] }>('/announcements').then(r => setItems(r.announcements));
  useEffect(() => { load(); }, []);

  const toggleArchive = async (id: string) => {
    await api.patch(`/announcements/${id}/toggle-status`);
    load();
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await api.post('/announcements', form);
      push('Announcement published to all students.');
      setDrawerOpen(false);
      setForm({ title: '', body: '', publishDate: '', priority: 'Normal' });
      load();
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Could not publish announcement.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Announcements" subtitle="Broadcast messages to all students" actions={<Button icon={<Plus size={15} />} onClick={() => setDrawerOpen(true)}>New Announcement</Button>}>
      {!items ? <Skeleton className="h-64 w-full" /> : (
        <div className="space-y-4">
          {items.map(a => (
            <Card key={a._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-md bg-gold-500/10 flex items-center justify-center shrink-0"><Megaphone size={17} className="text-gold-400" /></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-ink-100">{a.title}</h3>
                      <Badge tone={priorityTone[a.priority]}>{a.priority}</Badge>
                      <Badge tone={a.status === 'Published' ? 'success' : 'neutral'}>{a.status}</Badge>
                    </div>
                    <p className="text-sm text-ink-400">{a.body}</p>
                    <p className="text-xs text-ink-500 mt-1.5 coord-label">{new Date(a.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" icon={<Archive size={13} />} onClick={() => toggleArchive(a._id)}>{a.status === 'Published' ? 'Archive' : 'Publish'}</Button>
              </div>
            </Card>
          ))}
          {items.length === 0 && <Card className="p-8 text-center text-sm text-ink-500">No announcements yet.</Card>}
        </div>
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="New Announcement"
        footer={<><Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving || !form.title || !form.body}>{saving ? 'Publishing…' : 'Publish'}</Button></>}>
        <div className="space-y-4">
          <Input label="Title" placeholder="e.g. Class rescheduled" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <div>
            <label className="block text-sm text-ink-300 mb-1.5">Message</label>
            <textarea rows={4} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className="w-full bg-navy-800 border border-white/10 rounded-md p-3.5 text-sm text-ink-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <Input label="Publish date" type="date" value={form.publishDate} onChange={e => setForm({ ...form, publishDate: e.target.value })} />
          <Select label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as any })}
            options={[{ label: 'Normal', value: 'Normal' }, { label: 'Important', value: 'Important' }, { label: 'Urgent', value: 'Urgent' }]} />
        </div>
      </Drawer>
    </AdminLayout>
  );
}
