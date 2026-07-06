import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Youtube, FileText, StickyNote, Link2, CheckCircle2 } from 'lucide-react';
import StudentLayout from '@/components/layout/StudentLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import type { ContentType } from '@/types';

interface LearningItemDto {
  _id: string;
  title: string;
  type: ContentType;
  description: string;
  thumbnail: string;
  durationLabel?: string;
  publishedOn: string;
  completed?: boolean;
}

const typeIcons: Record<ContentType, any> = { YouTube: Youtube, PDF: FileText, Note: StickyNote, Link: Link2 };
const filters: (ContentType | 'All')[] = ['All', 'YouTube', 'PDF', 'Note', 'Link'];

export default function LearningHub() {
  const [items, setItems] = useState<LearningItemDto[] | null>(null);
  const [filter, setFilter] = useState<ContentType | 'All'>('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get<{ items: LearningItemDto[] }>('/learning-items').then(r => setItems(r.items));
  }, []);

  const filtered = useMemo(() => (items ?? []).filter(item =>
    (filter === 'All' || item.type === filter) &&
    item.title.toLowerCase().includes(query.toLowerCase()),
  ), [items, filter, query]);

  return (
    <StudentLayout title="Learning Hub">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            value={query} onChange={e => setQuery(e.target.value)} placeholder="Search resources…"
            className="w-full bg-navy-800 border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f} onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors ${filter === f ? 'bg-emerald-500/12 text-emerald-300' : 'text-ink-400 hover:bg-white/5 border border-white/8'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {!items ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={<Search size={22} />} title="No resources found" description="Try a different search term or filter." /></Card>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, i) => {
            const Icon = typeIcons[item.type];
            return (
              <motion.div key={item._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 0.9, 0.3, 1] }}>
                <Link to={`/student/learning-hub/${item._id}`}>
                  <Card hover className="overflow-hidden h-full">
                    <div className={`h-32 bg-gradient-to-br ${item.thumbnail} flex items-center justify-center relative`}>
                      <Icon size={30} className="text-white/80" />
                      {item.completed && (
                        <span className="absolute top-3 right-3 h-6 w-6 rounded-full bg-navy-950/70 flex items-center justify-center">
                          <CheckCircle2 size={15} className="text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge tone="info">{item.type}</Badge>
                        {item.durationLabel && <span className="text-xs text-ink-500">{item.durationLabel}</span>}
                      </div>
                      <h3 className="text-sm font-medium text-ink-100 leading-snug">{item.title}</h3>
                      <p className="text-xs text-ink-400 mt-1.5 line-clamp-2">{item.description}</p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </StudentLayout>
  );
}
