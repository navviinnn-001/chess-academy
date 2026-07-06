import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-navy-900">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 flex items-center justify-between h-[72px] px-5 md:px-8 border-b border-white/8 bg-navy-900/85 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-ink-300"><Menu size={20} /></button>
            <div>
              <h1 className="font-display text-xl text-ink-100">{title}</h1>
              {subtitle && <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <button className="relative h-9 w-9 rounded-md flex items-center justify-center text-ink-300 hover:bg-white/5" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold-400" />
            </button>
          </div>
        </div>
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 0.9, 0.3, 1] }}
          className="p-5 md:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
