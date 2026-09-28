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
                className="p-4 sm:p-5 hover:bg-slate-50/60 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Competency & Status */}
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-slate-900">{item.competencyName}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.status === 'Satisfied'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.status === 'Critical'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.status === 'Satisfied'
                        ? 'Benchmark Met'
                        : `${item.status} Gap: -${item.gap}%`}
                    </span>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-600">
                        Current: <strong>{item.currentScore}%</strong>
                      </span>
                      <span className="text-slate-400">
                        Required: <strong>{item.requiredScore}%</strong>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                      <div
                        className={`h-2.5 rounded-l-full ${
                          item.currentScore >= item.requiredScore ? 'bg-emerald-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${item.currentScore}%` }}
                      ></div>
                      {hasGap && (
                        <div
                          className="h-2.5 bg-red-400/80 rounded-r-full"
                          style={{ width: `${item.gap}%` }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Real Recommended Courses based on Stored Competency Mapping */}
                <div className="lg:w-2/3 lg:pl-6 lg:border-l border-slate-200">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Targeted Recommended Upskilling</span>
                  </p>

                  {item.recommendedCourses && item.recommendedCourses.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.recommendedCourses.map((c) => (
                        <Link
                          key={c.id}
                          href={`/courses/${c.id}`}
                          className="group p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg flex items-center justify-between gap-3 text-xs transition"
                        >
                          <div>
                            <div className="font-semibold text-slate-800 group-hover:text-blue-900">
                              {c.title}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {c.difficulty} • {c.duration}
                            </div>
                          </div>
                          <span className="p-1 bg-white rounded border border-slate-200 group-hover:border-blue-300 text-blue-900">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Operational proficiency fulfilled. No remedial modules required.</span>
                    </p>
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
