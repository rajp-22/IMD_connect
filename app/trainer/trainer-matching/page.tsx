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

export default async function TrainerMatchingPage({
  searchParams,
}: {
  searchParams: Promise<{ competencies?: string }>;
}) {
  const session = await getSession();
  if (!session || (session.role !== 'trainer' && session.role !== 'admin')) {
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
              Smart Trainer Competency Matching
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic, transparent mapping comparing course syllabus competencies against certified faculty profiles.
          </p>
        </div>
      </div>

      {/* Target Requirements Strip */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-5 rounded-xl border border-blue-900 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="text-xs text-blue-200">
            Current Course Evaluation Requirement:
          </div>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-mono">
            {reqComps.length} Competencies Required
          </span>
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

        <p className="text-[11px] text-blue-200">
          Transparent Scoring Formula: <code>Match % = (Matched Competencies ÷ Total Required) × 100</code>
        </p>
      </div>

      {/* Trainer Match Cards */}
      <div className="space-y-4">
        {matches.map((trainer, idx) => (
          <div
            key={trainer.trainerId}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            {/* Trainer Information */}
            <div className="space-y-2 md:w-2/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Rank #{idx + 1} Match
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {trainer.experienceYears} Years Experience
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{trainer.trainerName}</h3>
              <p className="text-xs text-slate-500">
                {trainer.designation} • {trainer.department}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {trainer.rating} / 5.0 Rating
                </span>
                <span>•</span>
                <span className="truncate">
                  Prior courses: <strong>{trainer.coursesPreviouslyTaught?.[0] || 'Meteorology SOPs'}</strong>
                </span>
              </div>
            </div>

            {/* Competency Check Breakdown */}
            <div className="space-y-2 md:w-2/5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Competency Match Breakdown:
              </div>
              <div className="space-y-1.5">
                {trainer.matchedCompetencies.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      {c.hasCompetency ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                      <span>{c.name}</span>
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        c.hasCompetency ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {c.hasCompetency ? `${c.score}% (${c.level})` : 'Missing ✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Match Score Badge */}
            <div className="md:w-1/5 text-center flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
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
                Competency Match
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {trainer.matchedCount} of {trainer.totalRequired} Matched
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
