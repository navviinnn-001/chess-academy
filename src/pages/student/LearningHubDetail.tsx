import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, PlayCircle, FileText, Sparkles } from 'lucide-react';
import StudentLayout from '@/components/layout/StudentLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

interface LearningItemDto {
  _id: string;
  title: string;
  type: string;
  description: string;
  thumbnail: string;
  publishedOn: string;
  completed?: boolean;
}

export default function LearningHubDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<LearningItemDto | null>(null);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    if (!id) return;
    api.get<{ item: LearningItemDto }>(`/learning-items/${id}`).then(r => {
      setItem(r.item);
      setCompleted(!!r.item.completed);
    });
  }, [id]);

  const markComplete = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await api.post(`/learning-items/${id}/complete`);
      setCompleted(true);
      push('Great work! Resource marked complete.');
    } finally {
      setSaving(false);
    }
  };

  if (!item) {
    return (
      <StudentLayout title="Learning Hub">
        <Skeleton className="h-96 w-full" />
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Learning Hub">
      <Link to="/student/learning-hub" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100 mb-6">
        <ArrowLeft size={15} /> Back to Learning Hub
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card className="overflow-hidden">
            <div className={`h-56 md:h-72 bg-gradient-to-br ${item.thumbnail} flex items-center justify-center relative`}>
              {item.type === 'YouTube' ? <PlayCircle size={52} className="text-white/85" /> : <FileText size={44} className="text-white/85" />}
            </div>
            <div className="p-6">
              <Badge tone="info">{item.type}</Badge>
              <h1 className="font-display text-2xl text-ink-100 mt-3">{item.title}</h1>
              <p className="text-sm text-ink-400 mt-2 leading-relaxed">{item.description}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-base text-ink-100 mb-3">Coach Notes</h3>
            <p className="text-sm text-ink-300 leading-relaxed">
              Review this resource before your next live class. Try to note down one idea you'd like
              to ask your coach about — bringing questions to class helps reinforce the concept faster.
            </p>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <p className="text-xs text-ink-500 mb-3">Progress</p>
            <AnimatePresence mode="wait">
              {completed ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-4 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
                    <CheckCircle2 size={40} className="text-emerald-400 mb-3" />
                  </motion.div>
                  <p className="text-sm text-ink-100 font-medium">Marked complete</p>
                  <Sparkles size={14} className="text-gold-400 mt-1" />
                </motion.div>
              ) : (
                <Button full variant="primary" icon={<CheckCircle2 size={16} />} onClick={markComplete} disabled={saving}>
                  {saving ? 'Saving…' : 'Mark Complete'}
                </Button>
              )}
            </AnimatePresence>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-ink-500 mb-2">Published</p>
            <p className="text-sm text-ink-300">{new Date(item.publishedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
