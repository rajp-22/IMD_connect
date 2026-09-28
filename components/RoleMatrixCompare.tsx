'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Building2,
  Filter,
} from 'lucide-react';
import { IRoleTemplate } from '@/lib/types';

interface ComparisonItem {
  competencyName: string;
  requiredLevel: string;
  requiredScore: number;
  currentScore: number;
  currentLevel: string;
  gap: number;
  meetsRequirement: boolean;
  recommendedCourses: { _id: string; title: string; difficulty: string; duration: string }[];
}

interface RoleMatrixCompareProps {
  roles: IRoleTemplate[];
  activeComparison: {
    role: IRoleTemplate;
    comparisons: ComparisonItem[];
    overallReadiness: number;
    disclaimer: string;
  };
  onSelectRole?: (roleCode: string) => void;
}

export default function RoleMatrixCompare({
  roles,
  activeComparison,
  onSelectRole,
}: RoleMatrixCompareProps) {
  const [selectedRoleCode, setSelectedRoleCode] = useState(activeComparison.role.code);

  const handleRoleChange = (code: string) => {
    setSelectedRoleCode(code);
    if (onSelectRole) onSelectRole(code);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
        <span>
          <strong>Administrative Notice:</strong> {activeComparison.disclaimer}
        </span>
      </div>

      {/* Role Selection Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Select Meteorological Target Role</h3>
          <p className="text-xs text-slate-500">
            Compare your competency benchmarks against official cadre requirements.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button
              key={r.code}
              onClick={() => handleRoleChange(r.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedRoleCode === r.code
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Role Summary Card */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-5 rounded-xl border border-blue-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
              Role Matrix
            </span>
            <span className="text-xs text-blue-200">{activeComparison.role.department}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{activeComparison.role.name}</h2>
          <p className="text-xs text-blue-200 max-w-xl mt-0.5">
            {activeComparison.role.description}
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/15 text-center sm:min-w-[130px] shrink-0">
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {activeComparison.overallReadiness}%
          </div>
          <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
            Role Readiness
          </div>
        </div>
      </div>

      {/* Comparison Grid (CURRENT vs REQUIRED) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Competency Benchmark Comparison
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            Formula: Skill Gap = Required - Current
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {activeComparison.comparisons.map((item, idx) => (
            <div
              key={idx}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
            >
              {/* Competency Info */}
              <div className="space-y-1 md:w-1/3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{item.competencyName}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border">
                    Level: {item.requiredLevel}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Target threshold established for operational forecasters.
                </div>
              </div>

              {/* CURRENT vs REQUIRED Bars */}
              <div className="flex items-center gap-6 md:w-1/3">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Current</span>
                    <span className="font-bold text-slate-800">{item.currentScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.meetsRequirement ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.currentScore}%` }}
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Required</span>
                    <span className="font-bold text-blue-900">{item.requiredScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-900 h-full rounded-full"
                      style={{ width: `${item.requiredScore}%` }}
                    />
                  </div>
                </div>

                <div className="shrink-0 w-8 text-center">
                  {item.meetsRequirement ? (
                    <span className="text-emerald-600 font-bold text-base" title="Requirement Met">
                      ✓
                    </span>
                  ) : (
                    <span
                      className="text-rose-600 font-bold text-base"
                      title={`Gap of ${item.gap}% detected`}
                    >
                      ⚠
                    </span>
                  )}
                </div>
              </div>

              {/* Recommended Course Link */}
              <div className="md:w-1/3 text-right">
                {item.gap > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-rose-600">
                      Gap: -{item.gap}%
                    </span>
                    {item.recommendedCourses.length > 0 && (
                      <div>
                        <Link
                          href={`/courses/${item.recommendedCourses[0]._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-xs font-semibold transition"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[180px]">
                            {item.recommendedCourses[0].title}
                          </span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Benchmark Satisfied
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
