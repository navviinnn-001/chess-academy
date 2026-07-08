import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import AmbientBackground from '@/components/ui/AmbientBackground';

interface AppShellProps {
  sidebar: ReactNode;
  topbar: ReactNode;
  bottomNav?: ReactNode;
  /** Used as the Framer Motion key so each page gets a fresh transition */
  transitionKey: string;
  contentClassName?: string;
  children: ReactNode;
}

/**
 * The structural shell shared by the Student and Admin portals: a fixed cinematic ambient
 * background, a sidebar slot, a topbar slot, and a page-transition wrapper for the routed
 * content. Individual portals supply their own sidebar/topbar components.
 */
export default function AppShell({ sidebar, topbar, bottomNav, transitionKey, contentClassName, children }: AppShellProps) {
  return (
    <div className="relative flex min-h-screen">
      <AmbientBackground intensity="subtle" />
      {sidebar}
      <div className="flex-1 min-w-0 relative z-10">
        {topbar}
        <motion.main
          key={transitionKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 0.9, 0.3, 1] }}
          className={contentClassName ?? 'p-5 md:p-8'}
        >
          {children}
        </motion.main>
      </div>
      {bottomNav}
    </div>
  );
}