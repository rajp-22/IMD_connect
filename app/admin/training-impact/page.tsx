import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTrainingImpactAnalytics } from '@/lib/data-service';
import TrainingImpactAnalyticsView from '@/components/TrainingImpactAnalyticsView';
import { BarChart3 } from 'lucide-react';

export default async function AdminTrainingImpactPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const metrics = await getTrainingImpactAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Training Impact Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical measurement of training interventions comparing baseline pre-assessments against post-certification outcomes.
          </p>
        </div>
      </div>

      <TrainingImpactAnalyticsView metrics={metrics} />
    </div>
  );
}
