import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getCompetencyPassport } from '@/lib/data-service';
import CompetencyPassportView from '@/components/CompetencyPassportView';
import { FileBadge, Printer } from 'lucide-react';

export default async function TraineePassportPage() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') {
    redirect('/login');
  }

  const passport = await getCompetencyPassport(session.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileBadge className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Competency Passport
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Government of India validated technical profile, certified competencies, and official credentials.
          </p>
        </div>
      </div>

      {passport ? (
        <CompetencyPassportView passport={passport} />
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          Passport not found.
        </div>
      )}
    </div>
  );
}
