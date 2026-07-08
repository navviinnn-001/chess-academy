import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Wallet, Lock, ClipboardList, Video, BookOpen,
  PuzzleIcon, Megaphone, Settings, Crown, LogOut, X,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/context/AuthContext';

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/payments', label: 'Payments', icon: Wallet },
  { to: '/admin/private-notes', label: 'Private Notes', icon: Lock },
  { to: '/admin/weekly-updates', label: 'Weekly Updates', icon: ClipboardList },
  { to: '/admin/live-classes', label: 'Live Classes', icon: Video },
  { to: '/admin/learning-content', label: 'Learning Content', icon: BookOpen },
  { to: '/admin/puzzles', label: 'Puzzle Manager', icon: PuzzleIcon },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = () => { logout(); navigate('/login'); };

  return (
    <>
      <div className="h-[72px] flex items-center gap-2.5 px-6 border-b border-white/8">
        <span className="h-8 w-8 rounded-md bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
          <Crown size={16} className="text-navy-950" />
        </span>
        <span className="editorial-heading text-sm text-ink-100 leading-tight">Admin Console<br /><span className="text-ink-500 text-[10px] tracking-[0.15em] font-sans">WE CARE CHESS</span></span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => cn(
              'relative flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm transition-colors duration-300',
              isActive ? 'text-gold-300' : 'text-ink-400 hover:text-ink-100 hover:bg-white/[0.04]',
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="admin-nav-active"
                    className="absolute inset-0 rounded-md bg-gold-500/10 border border-gold-500/25 shadow-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon size={17} className="relative z-10" />
                <span className="relative z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/8">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-navy-950 text-xs font-semibold">
            AD
          </div>
          <div className="min-w-0">
            <p className="text-sm text-ink-100 truncate">{user?.name ?? 'Academy Admin'}</p>
            <p className="text-xs text-ink-500">Owner / Coach</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-2 text-xs text-ink-500 hover:text-danger transition-colors mt-2 px-2">
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar({ mobileOpen, onCloseMobile }: { mobileOpen?: boolean; onCloseMobile?: () => void }) {
  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 z-10 border-r hairline-gold bg-navy-950/70 backdrop-blur-md">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="lg:hidden fixed inset-0 z-[80]" initial="hidden" animate="visible" exit="hidden">
            <motion.div
              className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              onClick={onCloseMobile}
            />
            <motion.aside
              className="absolute left-0 top-0 h-full w-72 flex flex-col bg-navy-950 border-r hairline-gold shadow-elevate"
              variants={{ hidden: { x: '-100%' }, visible: { x: 0 } }}
              transition={{ duration: 0.34, ease: [0.22, 0.9, 0.3, 1] }}
            >
              <button onClick={onCloseMobile} aria-label="Close menu" className="absolute top-5 right-4 text-ink-400 hover:text-ink-100 z-10">
                <X size={20} />
              </button>
              <SidebarContent onNavigate={onCloseMobile} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}