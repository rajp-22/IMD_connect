import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PrototypeDisclaimer from '@/components/PrototypeDisclaimer';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // If unauthenticated, redirect to login
  if (!user) {
    redirect('/login?demo=admin');
  }

  // If not admin, redirect to respective dashboard
  if (user.role !== 'admin') {
    if (user.role === 'trainer') redirect('/trainer/dashboard');
    else redirect('/trainee/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} />
      <PrototypeDisclaimer />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          role="admin"
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
