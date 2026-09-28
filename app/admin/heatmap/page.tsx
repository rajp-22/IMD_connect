import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDepartmentSkillHeatmap, getDepartmentTrainingInsights } from '@/lib/data-service';
import SkillHeatmapView from '@/components/SkillHeatmapView';
import { Grid3X3 } from 'lucide-react';

export default async function AdminHeatmapPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const heatmap = await getDepartmentSkillHeatmap();
  const insights = await getDepartmentTrainingInsights();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Organizational Skill Heatmap & Department Insights
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time competency coverage analysis across meteorological divisions, identifying priority upskilling needs.
          </p>
        </div>
      </div>

      <SkillHeatmapView heatmap={heatmap} insights={insights} />
    </div>
  );
}
