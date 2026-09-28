import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { calculateTrainerCompetencyMatches } from '@/lib/data-service';
import {
  Target,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  Briefcase,
  Star,
  Info,
} from 'lucide-react';

export default async function AdminTrainerMatchingPage({
  searchParams,
}: {
  searchParams: Promise<{ competencies?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const { competencies } = await searchParams;
  const reqComps = competencies
    ? competencies.split(',').map((c) => c.trim())
    : ['Meteorology', 'Weather Forecasting', 'Data Analysis'];

  const matches = await calculateTrainerCompetencyMatches(reqComps);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Administrative Trainer Matching Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Determine optimal faculty assignments for newly commissioned courses based on verified competency mastery.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-5 rounded-xl border border-blue-900 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
          <span>Active Course Requirement Criteria</span>
          <span className="font-mono text-amber-300">{reqComps.length} Required Domains</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {reqComps.map((comp) => (
            <span
              key={comp}
              className="text-xs bg-white/10 text-white px-3 py-1 rounded-lg border border-white/20 font-semibold"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {matches.map((trainer, idx) => (
          <div
            key={trainer.trainerId}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 md:w-2/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Match Rank #{idx + 1}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {trainer.experienceYears} Years Experience
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{trainer.trainerName}</h3>
              <p className="text-xs text-slate-500">
                {trainer.designation} • {trainer.department}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-semibold text-amber-700">{trainer.rating} / 5.0 Rating</span>
              </div>
            </div>

            <div className="space-y-1.5 md:w-2/5 text-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Evaluation:</div>
              {trainer.matchedCompetencies.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    {c.hasCompetency ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    )}
                    <span>{c.name}</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold">
                    {c.hasCompetency ? `${c.score}% (${c.level})` : 'Missing ✗'}
                  </span>
                </div>
              ))}
            </div>

            <div className="md:w-1/5 text-center p-3 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
              <div
                className={`text-3xl font-extrabold font-mono ${
                  trainer.matchScore >= 80
                    ? 'text-emerald-600'
                    : trainer.matchScore >= 60
                    ? 'text-blue-900'
                    : 'text-amber-600'
                }`}
              >
                {trainer.matchScore}%
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">
                Match Score
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
