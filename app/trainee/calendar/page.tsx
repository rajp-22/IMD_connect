import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTrainingEvents } from '@/lib/data-service';
import CentralizedCalendar from '@/components/CentralizedCalendar';

export default async function TraineeCalendarPage() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') {
    redirect('/login');
  }

  const events = await getTrainingEvents(session.id, 'trainee');

  return (
    <CentralizedCalendar
      initialEvents={events}
      userRole="trainee"
      currentUserId={session.id}
      currentUserName={session.name}
    />
  );
}
