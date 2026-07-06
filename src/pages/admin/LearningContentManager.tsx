import { useEffect, useRef, useState } from 'react';
import { Plus, UploadCloud, Youtube, FileText, StickyNote, Link2, Eye } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import { Drawer, Modal } from '@/components/ui/Modal';
import { api, uploadFile } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { ApiClientError } from '@/context/AuthContext';
import type { ContentType } from '@/types';

const typeIcons: Record<ContentType, any> = { YouTube: Youtube, PDF: FileText, Note: StickyNote, Link: Link2 };

interface ItemDto {
  _id: string; title: string; type: ContentType; description: string; thumbnail: string; status: 'draft' | 'published';
}

export default function LearningContentManager() {
  const [items, setItems] = useState<ItemDto[] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ type: 'YouTube' as ContentType, title: '', description: '', url: '', status: 'published' as 'draft' | 'published' });
  const fileRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const load = () => api.get<{ items: ItemDto[] }>('/learning-items').then(r => setItems(r.items));
  useEffect(() => { load(); }, []);

  const previewItem = items?.find(i => i._id === previewId);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await uploadFile(file);
      push('Thumbnail uploaded.');
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Upload failed.', 'warning');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await api.post('/learning-items', form);
      push('Content published to Learning Hub.');
      setDrawerOpen(false);
      setForm({ type: 'YouTube', title: '', description: '', url: '', status: 'published' });
      load();
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Could not save content.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Learning Content" subtitle="Manage videos, PDFs, notes and links" actions={<Button icon={<Plus size={15} />} onClick={() => setDrawerOpen(true)}>Add Content</Button>}>
      {!items ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52 w-full" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(i => {
            const Icon = typeIcons[i.type];
            return (
              <Card key={i._id} hover className="overflow-hidden">
                <div className={`h-28 bg-gradient-to-br ${i.thumbnail} flex items-center justify-center`}><Icon size={26} className="text-white/80" /></div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge tone="info">{i.type}</Badge>
                    <Badge tone={i.status === 'published' ? 'success' : 'neutral'}>{i.status}</Badge>
                  </div>
                  <h3 className="text-sm font-medium text-ink-100">{i.title}</h3>
                  <p className="text-xs text-ink-400 mt-1.5 line-clamp-2">{i.description}</p>
                  <Button size="sm" variant="ghost" icon={<Eye size={13} />} className="mt-2 px-0" onClick={() => setPreviewId(i._id)}>Preview</Button>
                </div>
              </Card>
            );
          })}
          {items.length === 0 && <Card className="p-8 text-center text-sm text-ink-500 sm:col-span-2 lg:col-span-3">No content published yet.</Card>}
        </div>
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Learning Content"
        footer={<><Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving || !form.title}>{saving ? 'Publishing…' : 'Publish Content'}</Button></>}>
        <div className="space-y-4">
          <Select label="Content type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ContentType })}
            options={[{ label: 'YouTube video', value: 'YouTube' }, { label: 'PDF', value: 'PDF' }, { label: 'Lesson note', value: 'Note' }, { label: 'External link', value: 'Link' }]} />
          <Input label="Title" placeholder="e.g. Basic Checkmating Patterns" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <div>
            <label className="block text-sm text-ink-300 mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-navy-800 border border-white/10 rounded-md p-3.5 text-sm text-ink-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <Input label="URL" placeholder="YouTube / link URL (if applicable)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />

          <div>
            <label className="block text-sm text-ink-300 mb-1.5">Thumbnail</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
              onClick={() => fileRef.current?.click()}
              className={`rounded-md border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-emerald-400 bg-emerald-500/5' : 'border-white/12 hover:border-white/20'}`}
            >
              <UploadCloud size={22} className="mx-auto text-ink-500 mb-2" />
              <p className="text-xs text-ink-400">{uploading ? 'Uploading…' : 'Drag & drop an image, or click to browse'}</p>
              <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
            </div>
          </div>

          <Select label="Visibility" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
            options={[{ label: 'Published', value: 'published' }, { label: 'Draft', value: 'draft' }]} />
        </div>
      </Drawer>

      <Modal open={!!previewId} onClose={() => setPreviewId(null)} title="Student Preview">
        {previewItem && (
          <Card className="overflow-hidden">
            <div className={`h-40 bg-gradient-to-br ${previewItem.thumbnail} flex items-center justify-center`} />
            <div className="p-5">
              <Badge tone="info">{previewItem.type}</Badge>
              <h3 className="font-display text-lg text-ink-100 mt-3">{previewItem.title}</h3>
              <p className="text-sm text-ink-300 mt-1.5">{previewItem.description}</p>
            </div>
          </Card>
        )}
      </Modal>
    </AdminLayout>
  );
}
