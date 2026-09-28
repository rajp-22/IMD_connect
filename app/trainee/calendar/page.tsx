import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTrainingEvents } from '@/lib/data-service';
import TrainingCalendarView from '@/components/TrainingCalendarView';
import { Calendar } from 'lucide-react';

export default async function TraineeCalendarPage() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') {
    redirect('/login');
  }

  const events = await getTrainingEvents(session.id, 'trainee');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Training Calendar
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalized schedule of upcoming live lectures, assessment deadlines, and national workshops.
          </p>
        </div>
      </div>

      <TrainingCalendarView events={events} userRole="trainee" />
    </div>
  );
}
