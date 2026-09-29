import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTrainingEvents } from '@/lib/data-service';
import CentralizedCalendar from '@/components/CentralizedCalendar';

export const dynamic = 'force-dynamic';

export default async function AdminCalendarPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login?demo=admin');
  }

  // Admin gets global access across all three domains: trainee, trainer, administrative
  const events = await getTrainingEvents(session.id, 'admin');

  return (
    <CentralizedCalendar
      initialEvents={events}
      userRole="admin"
      currentUserId={session.id}
      currentUserName={session.name}
    />
  );
}
