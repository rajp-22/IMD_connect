import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTrainingEvents } from '@/lib/data-service';
import CentralizedCalendar from '@/components/CentralizedCalendar';

export default async function TrainerCalendarPage() {
  const session = await getSession();
  if (!session || session.role !== 'trainer') {
    redirect('/login');
  }

  const events = await getTrainingEvents(session.id, 'trainer');

  return (
    <CentralizedCalendar
      initialEvents={events}
      userRole="trainer"
      currentUserId={session.id}
      currentUserName={session.name}
    />
  );
}
