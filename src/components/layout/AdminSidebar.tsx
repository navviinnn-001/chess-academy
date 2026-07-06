import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Wallet, Lock, ClipboardList, Video, BookOpen,
  PuzzleIcon, Megaphone, Settings, Crown, LogOut,
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

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = () => { logout(); navigate('/login'); };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/8 bg-navy-950/60">
      <div className="h-[72px] flex items-center gap-2.5 px-6 border-b border-white/8">
        <span className="h-8 w-8 rounded-md bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
          <Crown size={16} className="text-navy-950" />
        </span>
        <span className="font-display text-sm text-ink-100 leading-tight">Admin Console<br /><span className="text-ink-500 text-[10px] tracking-wider">WE CARE CHESS</span></span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm transition-colors relative',
              isActive ? 'bg-gold-500/12 text-gold-300' : 'text-ink-400 hover:text-ink-100 hover:bg-white/5',
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gold-400" />}
                <Icon size={17} />
                {label}
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
        <button onClick={handleSignOut} className="flex items-center gap-2 text-xs text-ink-500 hover:text-danger mt-2 px-2">
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  );
}
