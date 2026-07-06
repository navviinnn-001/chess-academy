import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { StudentSidebar, StudentBottomNav } from './StudentNav';
import StudentTopbar from './StudentTopbar';

export default function StudentLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-navy-900">
      <StudentSidebar />
      <div className="flex-1 min-w-0">
        <StudentTopbar title={title} />
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 0.9, 0.3, 1] }}
          className="p-5 md:p-8 pb-24 lg:pb-8 max-w-7xl"
        >
          {children}
        </motion.main>
      </div>
      <StudentBottomNav />
    </div>
  );
}
