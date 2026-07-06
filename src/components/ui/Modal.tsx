import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export function Modal({ open, onClose, title, children, footer, width = 'max-w-lg' }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-4" initial="hidden" animate="visible" exit="hidden">
          <motion.div
            className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full ${width} rounded-lg border border-white/10 bg-navy-800 shadow-elevate`}
            variants={{ hidden: { opacity: 0, y: 16, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1 } }}
            transition={{ duration: 0.26, ease: [0.22, 0.9, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h3 className="font-display text-lg text-ink-100">{title}</h3>
              <button onClick={onClose} className="text-ink-400 hover:text-ink-100 p-1 rounded-md hover:bg-white/5">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-white/8 flex justify-end gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Drawer({ open, onClose, title, children, footer }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90]" initial="hidden" animate="visible" exit="hidden">
          <motion.div
            className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            onClick={onClose}
          />
          <motion.div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-navy-800 border-l border-white/10 shadow-elevate flex flex-col"
            variants={{ hidden: { x: '100%' }, visible: { x: 0 } }}
            transition={{ duration: 0.32, ease: [0.22, 0.9, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h3 className="font-display text-lg text-ink-100">{title}</h3>
              <button onClick={onClose} className="text-ink-400 hover:text-ink-100 p-1 rounded-md hover:bg-white/5">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-white/8 flex justify-end gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
