'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { ISkillGap, ITraineeCompetency } from '@/lib/types';

interface SkillGapVisualizerProps {
  competencies: ITraineeCompetency[];
  skillGaps: ISkillGap[];
}

export default function SkillGapVisualizer({
  competencies,
  skillGaps,
}: SkillGapVisualizerProps) {
  return (
    <div className="space-y-6">
      {/* Competency Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competencies.slice(0, 4).map((c) => (
          <div
            key={c._id}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {c.domain}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  c.level === 'Advanced'
                    ? 'bg-emerald-100 text-emerald-800'
                    : c.level === 'Intermediate'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {c.level}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">{c.competencyName}</h4>
            <div className="flex items-baseline justify-between mb-1.5 font-mono">
              <span className="text-xl font-extrabold text-blue-950">{c.score}%</span>
              <span className="text-[11px] text-slate-400">Target: 75%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  c.score >= 75
                    ? 'bg-emerald-600'
                    : c.score >= 50
                    ? 'bg-blue-600'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${c.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Skill Gap Comparison Table & Recommendations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-900" />
              <span>Skill Gap Identification & Targeted Course Recommendation</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live algorithmic comparison of current individual competency against IMD departmental
              operational requirements.
            </p>
          </div>
          <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2.5 py-1 rounded font-semibold hidden sm:inline-block">
            {skillGaps.filter((g) => g.gap > 0).length} Skill Gaps Identified
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {skillGaps.map((item, idx) => {
            const hasGap = item.gap > 0;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 hover:bg-slate-50/60 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Competency & Status */}
                <div className="lg:w-1/2 space-y-3">
                  <div className="flex items-center gap-2">
                    {hasGap ? (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <h4 className="text-sm font-bold text-slate-900 font-serif">
                      {item.competencyName}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        item.status === 'Satisfied'
                          ? 'badge-status-completed'
                          : item.status === 'Critical'
                          ? 'badge-status-error'
                          : 'badge-status-pending'
                      }`}
                    >
                      {item.status === 'Satisfied' ? 'Benchmark Satisfied' : `Gap: ${item.gap}%`}
                    </span>
                  </div>

                  {/* Current vs Required Metrics Card */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Current Level
                      </span>
                      <span className="text-lg font-bold font-mono text-slate-900">
                        {item.currentScore}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Required Level
                      </span>
                      <span className="text-lg font-bold font-mono text-blue-900">
                        {item.requiredScore}%
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                      <div
                        className={`h-2 rounded-l-full ${
                          item.currentScore >= item.requiredScore ? 'bg-emerald-600' : 'bg-blue-900'
                        }`}
                        style={{ width: `${item.currentScore}%` }}
                      />
                      {hasGap && (
                        <div
                          className="h-2 bg-rose-400 rounded-r-full"
                          style={{ width: `${item.gap}%` }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Recommended Course with Start Learning CTA */}
                <div className="lg:w-1/2 lg:pl-6 lg:border-l border-slate-200 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Recommended Training Module</span>
                  </p>

                  {item.recommendedCourses && item.recommendedCourses.length > 0 ? (
                    <div className="space-y-2">
                      {item.recommendedCourses.map((c) => (
                        <div
                          key={c.id}
                          className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900 font-serif">
                              {c.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {c.difficulty} • Duration: {c.duration}
                            </div>
                          </div>
                          <Link
                            href={`/courses/${c.id}`}
                            className="btn-primary py-1.5 px-3 text-xs shrink-0 self-start sm:self-center"
                          >
                            <span>Start Learning</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Benchmark fulfilled. No remedial course needed for this competency.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
