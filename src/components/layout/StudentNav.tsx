import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Video, BookOpen, PuzzleIcon, ClipboardList, TrendingUp, User, Crown, LogOut } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/context/AuthContext';

const items = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/live-classes', label: 'Live Classes', icon: Video },
  { to: '/student/learning-hub', label: 'Learning Hub', icon: BookOpen },
  { to: '/student/puzzles', label: 'Puzzle Practice', icon: PuzzleIcon },
  { to: '/student/weekly-updates', label: 'Weekly Updates', icon: ClipboardList },
  { to: '/student/progress', label: 'My Progress', icon: TrendingUp },
  { to: '/student/profile', label: 'Profile', icon: User },
];

const mobileItems = items.filter(i => ['/student/dashboard', '/student/live-classes', '/student/learning-hub', '/student/puzzles', '/student/profile'].includes(i.to));

export function StudentSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') ?? '';

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 z-10 border-r hairline-gold bg-navy-950/70 backdrop-blur-md">
      <div className="h-[72px] flex items-center gap-2.5 px-6 border-b border-white/8">
        <span className="h-8 w-8 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-glow">
          <Crown size={16} className="text-navy-950" />
        </span>
        <span className="editorial-heading text-sm text-ink-100 leading-tight">WE CARE<br /><span className="text-ink-500 text-[10px] tracking-[0.15em] font-sans">CHESS ACADEMY</span></span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'relative flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm transition-colors duration-300',
              isActive ? 'text-emerald-300' : 'text-ink-400 hover:text-ink-100 hover:bg-white/[0.04]',
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="student-nav-active"
                    className="absolute inset-0 rounded-md bg-emerald-500/10 border border-emerald-500/25 shadow-glow"
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
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 text-xs font-semibold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-ink-100 truncate">{user?.name}</p>
            <p className="text-xs text-ink-500">Student</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-2 text-xs text-ink-500 hover:text-danger transition-colors mt-2 px-2">
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  );
}

export function StudentBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-navy-950/95 backdrop-blur-md border-t hairline-gold flex justify-around px-2 py-2">
      {mobileItems.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => cn('flex flex-col items-center gap-1 px-3 py-1.5 rounded-md text-[10px] transition-colors', isActive ? 'text-emerald-300' : 'text-ink-500')}>
          <Icon size={19} />
          {label.split(' ')[0]}
        </NavLink>
      ))}
    </nav>
  );
}