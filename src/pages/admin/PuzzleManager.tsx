import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, UploadCloud, Search, Eye } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import { Drawer, Modal } from '@/components/ui/Modal';
import { SquareHighlight } from '@/components/ui/ChessMotifs';
import { api, uploadFile, ASSET_BASE_URL } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { ApiClientError } from '@/context/AuthContext';
import type { Difficulty } from '@/types';

const diffTone: Record<Difficulty, 'success' | 'gold' | 'warning' | 'danger'> = {
  Beginner: 'success', Easy: 'gold', Intermediate: 'warning', Advanced: 'danger',
};

interface PuzzleDto {
  _id: string; title: string; topic: string; difficulty: Difficulty; instruction: string;
  hint: string; answer: string; explanation: string; imageUrl?: string; status: 'draft' | 'published';
}

const emptyForm = { title: '', topic: '', difficulty: 'Beginner' as Difficulty, instruction: '', hint: '', answer: '', explanation: '', youtubeLink: '', status: 'draft' as 'draft' | 'published', imageUrl: '' };

export default function PuzzleManager() {
  const [puzzles, setPuzzles] = useState<PuzzleDto[] | null>(null);
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const load = () => api.get<{ puzzles: PuzzleDto[] }>('/puzzles').then(r => setPuzzles(r.puzzles));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => (puzzles ?? []).filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) && (difficulty === 'All' || p.difficulty === difficulty),
  ), [puzzles, query, difficulty]);

  const previewPuzzle = puzzles?.find(p => p._id === previewId);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      setForm(f => ({ ...f, imageUrl: url }));
      push('Puzzle image uploaded.');
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Upload failed.', 'warning');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await api.post('/puzzles', form);
      push('Puzzle saved.');
      setDrawerOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Could not save puzzle.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Puzzle Manager" subtitle="Upload and manage puzzle sets" actions={<Button icon={<Plus size={15} />} onClick={() => setDrawerOpen(true)}>Upload Puzzle</Button>}>
      <Card className="mb-5 p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search puzzles…"
            className="w-full bg-navy-800 border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
        </div>
        <Select options={[{ label: 'All difficulties', value: 'All' }, { label: 'Beginner', value: 'Beginner' }, { label: 'Easy', value: 'Easy' }, { label: 'Intermediate', value: 'Intermediate' }, { label: 'Advanced', value: 'Advanced' }]} value={difficulty} onChange={e => setDifficulty(e.target.value)} className="md:w-52" />
      </Card>

      {!puzzles ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52 w-full" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => (
            <Card key={p._id} hover className="overflow-hidden">
              <div className="h-28 bg-navy-700/60 flex items-center justify-center border-b border-white/8 overflow-hidden">
                {p.imageUrl ? <img src={`${ASSET_BASE_URL}${p.imageUrl}`} alt={p.title} className="h-full w-full object-cover" /> : <SquareHighlight size={70} />}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge tone={diffTone[p.difficulty]}>{p.difficulty}</Badge>
                  <Badge tone={p.status === 'published' ? 'success' : 'neutral'}>{p.status}</Badge>
                </div>
                <h3 className="text-sm font-medium text-ink-100">{p.title}</h3>
                <p className="text-xs text-ink-400 mt-1">{p.topic}</p>
                <Button size="sm" variant="ghost" icon={<Eye size={13} />} className="mt-2 px-0" onClick={() => setPreviewId(p._id)}>Preview</Button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <Card className="p-8 text-center text-sm text-ink-500 sm:col-span-2 lg:col-span-3">No puzzles match your filters.</Card>}
        </div>
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Upload Puzzle"
        footer={<><Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving || !form.title || !form.answer}>{saving ? 'Saving…' : 'Save Puzzle'}</Button></>}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-ink-300 mb-1.5">Puzzle image (JPG/PNG)</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
              onClick={() => fileRef.current?.click()}
              className={`rounded-md border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-emerald-400 bg-emerald-500/5' : 'border-white/12 hover:border-white/20'}`}
            >
              <UploadCloud size={22} className="mx-auto text-ink-500 mb-2" />
              <p className="text-xs text-ink-400">{uploading ? 'Uploading…' : form.imageUrl ? 'Image uploaded ✓ — click to replace' : 'Drag & drop puzzle image, or click to browse'}</p>
              <input ref={fileRef} type="file" className="hidden" accept="image/png,image/jpeg" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
            </div>
          </div>
          <Input label="Title" placeholder="e.g. Fork Finder" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Topic" placeholder="e.g. Knight Forks" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
            <Select label="Difficulty" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value as Difficulty })}
              options={[{ label: 'Beginner', value: 'Beginner' }, { label: 'Easy', value: 'Easy' }, { label: 'Intermediate', value: 'Intermediate' }, { label: 'Advanced', value: 'Advanced' }]} />
          </div>
          <Input label="Instruction" placeholder="e.g. White to move and win" value={form.instruction} onChange={e => setForm({ ...form, instruction: e.target.value })} />
          <Input label="Hint" placeholder="A gentle nudge toward the idea" value={form.hint} onChange={e => setForm({ ...form, hint: e.target.value })} />
          <Input label="Answer" placeholder="e.g. Nf6+" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} />
          <div>
            <label className="block text-sm text-ink-300 mb-1.5">Explanation</label>
            <textarea rows={3} value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} className="w-full bg-navy-800 border border-white/10 rounded-md p-3.5 text-sm text-ink-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <Input label="YouTube explanation link (optional)" placeholder="https://youtube.com/…" value={form.youtubeLink} onChange={e => setForm({ ...form, youtubeLink: e.target.value })} />
          <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
            options={[{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }]} />
        </div>
      </Drawer>

      <Modal open={!!previewId} onClose={() => setPreviewId(null)} title="Student Preview">
        {previewPuzzle && (
          <Card className="overflow-hidden">
            <div className="h-48 bg-navy-700/60 flex items-center justify-center border-b border-white/8 overflow-hidden">
              {previewPuzzle.imageUrl ? <img src={`${ASSET_BASE_URL}${previewPuzzle.imageUrl}`} alt={previewPuzzle.title} className="h-full w-full object-cover" /> : <SquareHighlight size={120} />}
            </div>
            <div className="p-5">
              <Badge tone={diffTone[previewPuzzle.difficulty]}>{previewPuzzle.difficulty}</Badge>
              <h3 className="font-display text-lg text-ink-100 mt-3">{previewPuzzle.title}</h3>
              <p className="text-sm text-ink-300 mt-1.5">{previewPuzzle.instruction}</p>
            </div>
          </Card>
        )}
      </Modal>
    </AdminLayout>
  );
}
