import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

type ToastTone = 'success' | 'info' | 'warning';
interface ToastItem { id: number; message: string; tone: ToastTone; }

const ToastContext = createContext<{ push: (message: string, tone?: ToastTone) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const icons: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 size={18} className="text-emerald-400" />,
  info: <Info size={18} className="text-ink-300" />,
  warning: <AlertTriangle size={18} className="text-warning" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random();
    setItems(prev => [...prev, { id, message, tone }]);
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 3600);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[min(360px,90vw)]">
        <AnimatePresence>
          {items.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 0.9, 0.3, 1] }}
              className="glass rounded-md px-4 py-3 flex items-start gap-2.5 shadow-elevate"
            >
              {icons[t.tone]}
              <p className="text-sm text-ink-100 flex-1">{t.message}</p>
              <button onClick={() => setItems(prev => prev.filter(x => x.id !== t.id))} className="text-ink-500 hover:text-ink-200">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
