import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function StudentTopbar({ title }: { title: string }) {
  const { user } = useAuth();
  const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') ?? '';

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between h-[72px] px-5 md:px-8 border-b border-white/8 bg-navy-900/85 backdrop-blur-md">
      <div>
        <h1 className="font-display text-xl text-ink-100">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative h-9 w-9 rounded-md flex items-center justify-center text-ink-300 hover:bg-white/5" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 text-xs font-semibold lg:hidden">
          {initials}
        </div>
      </div>
    </div>
  );
}
