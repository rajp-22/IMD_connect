import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PrototypeDisclaimer from '@/components/PrototypeDisclaimer';

export const dynamic = 'force-dynamic';

export default async function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // If unauthenticated, redirect to login
  if (!user) {
    redirect('/login?demo=trainee');
  }

  // If trainer logged in, redirect them to trainer dashboard unless admin is inspecting
  if (user.role === 'trainer') {
    redirect('/trainer/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} />
      <PrototypeDisclaimer />
      <div className="flex-1 flex flex-col md:flex-row w-full portal-dashboard-wrapper">
        <Sidebar
          role="trainee"
          userName={user.name}
          designation={user.designation}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
