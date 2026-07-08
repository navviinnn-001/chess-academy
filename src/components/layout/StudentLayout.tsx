import { type ReactNode } from 'react';
import AppShell from './AppShell';
import { StudentSidebar, StudentBottomNav } from './StudentNav';
import StudentTopbar from './StudentTopbar';

export default function StudentLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AppShell
      transitionKey={title}
      sidebar={<StudentSidebar />}
      topbar={<StudentTopbar title={title} />}
      bottomNav={<StudentBottomNav />}
      contentClassName="p-5 md:p-8 pb-24 lg:pb-8 max-w-7xl"
    >
      {children}
    </AppShell>
  );
}