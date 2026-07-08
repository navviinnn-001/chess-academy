import { type ReactNode, useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import AppShell from './AppShell';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const topbar = (
    <div className="sticky top-0 z-20 flex items-center justify-between h-[72px] px-5 md:px-8 border-b border-white/8 bg-navy-900/85 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-ink-300 hover:text-ink-100" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
        </button>
        <div>
          <h1 className="editorial-heading text-xl text-ink-100">{title}</h1>
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
  );

  return (
    <AppShell
      transitionKey={title}
      sidebar={<AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />}
      topbar={topbar}
    >
      {children}
    </AppShell>
  );
}