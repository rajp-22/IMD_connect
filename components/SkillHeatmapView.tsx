'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Grid3X3,
  Filter,
  Users,
  TrendingDown,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  X,
  Building2,
  Award,
  Sparkles,
} from 'lucide-react';
import { IDepartmentSkillCoverage, IDepartmentSkillCell } from '@/lib/types';

interface SkillHeatmapViewProps {
  heatmap: IDepartmentSkillCoverage[];
  insights: {
    topSkillGaps: { name: string; gap: number; affectedEmployees: number }[];
    mostRequestedCourses: { title: string; demand: number }[];
    lowestCompetencyAreas: { name: string; avgScore: number }[];
    completionRate: number;
    avgImprovement: number;
  };
}

export default function SkillHeatmapView({ heatmap, insights }: SkillHeatmapViewProps) {
  const [selectedCell, setSelectedCell] = useState<{
    department: string;
    cell: IDepartmentSkillCell;
  } | null>(null);

  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [selectedCompFilter, setSelectedCompFilter] = useState<string>('All');

  // Competency columns to display
  const competencyHeaders = ['Forecasting', 'Python', 'Satellite', 'Meteorology', 'Radar'];

  const filteredHeatmap = heatmap.filter((d) => {
    if (selectedDeptFilter !== 'All' && d.department !== selectedDeptFilter) return false;
    return true;
  });

  const getCellColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-600 text-white font-bold';
    if (score >= 70) return 'bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300';
    if (score >= 55) return 'bg-amber-100 text-amber-900 font-semibold border border-amber-300';
    return 'bg-rose-100 text-rose-900 font-bold border border-rose-300';
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-900" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Heatmap Filters:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5 font-medium">Department</label>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            >
              <option value="All">All Departments (5)</option>
              {heatmap.map((h) => (
                <option key={h.department} value={h.department}>
                  {h.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5 font-medium">Time Period</label>
            <select className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-800 focus:outline-hidden">
              <option>Current Q1 2026</option>
              <option>Previous Q4 2025</option>
              <option>Annual Climatology Cycle 2025-2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Visual Heatmap Table (Feature 10) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Department Competency Coverage Heatmap
            </h3>
            <p className="text-xs text-slate-500">
              Color thresholds: <span className="text-emerald-700 font-semibold">Green (≥70% Satisfied)</span>,{' '}
              <span className="text-amber-700 font-semibold">Amber (55-69% Moderate Gap)</span>,{' '}
              <span className="text-rose-700 font-semibold">Red (&lt;55% Critical Gap)</span>. Click any cell to inspect breakdown.
            </p>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-mono font-semibold">
            Admin Only
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                <th className="p-3.5 pl-4">Department</th>
                <th className="p-3.5 text-center">Staff Count</th>
                {competencyHeaders.map((header) => (
                  <th key={header} className="p-3.5 text-center">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredHeatmap.map((row) => (
                <tr key={row.department} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5 pl-4 font-semibold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-900 shrink-0" />
                    <span>{row.department}</span>
                  </td>
                  <td className="p-3.5 text-center text-slate-500 font-mono">
                    {row.totalEmployees}
                  </td>
                  {competencyHeaders.map((header) => {
                    const cell = row.competencies.find(
                      (c) => c.competencyName.toLowerCase() === header.toLowerCase()
                    );
                    const score = cell ? cell.averageScore : 65;

                    return (
                      <td key={header} className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => cell && setSelectedCell({ department: row.department, cell })}
                          className={`w-full py-2 rounded-lg text-xs transition transform hover:scale-105 cursor-pointer shadow-2xs ${getCellColor(
                            score
                          )}`}
                          title={`Click to inspect ${header} for ${row.department}`}
                        >
                          {score}%
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Training Insights (Feature 11) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Skill Gaps */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Top Priority Skill Gaps (Department Insights)
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Automated Aggregation</span>
          </div>

          <div className="space-y-2.5">
            {insights.topSkillGaps.map((gap, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{gap.name}</div>
                    <div className="text-[10px] text-slate-500">
                      Average Gap: <span className="text-rose-600 font-semibold">{gap.gap}%</span> •{' '}
                      {gap.affectedEmployees} Employees affected
                    </div>
                  </div>
                </div>
                <Link
                  href={`/admin/courses?filter=${encodeURIComponent(gap.name)}`}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded text-[11px] font-semibold flex items-center gap-1 transition"
                >
                  <span>Assign Training</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Most Requested Courses & Performance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-900" />
              <h4 className="text-sm font-bold text-slate-900">
                Highest Demand & Requested Courses
              </h4>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              Completion Rate: {insights.completionRate}%
            </span>
          </div>

          <div className="space-y-2.5">
            {insights.mostRequestedCourses.map((c, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">{c.title}</div>
                  <div className="text-[10px] text-slate-500">
                    Demand Index: <span className="font-semibold text-blue-900">{c.demand} personnel</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                  #{i + 1} Demand
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Drill-Down when clicking Heatmap Cell */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-950 to-blue-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300">
                  Heatmap Drill-Down Detail
                </span>
                <h4 className="text-base font-bold">{selectedCell.cell.competencyName}</h4>
                <p className="text-xs text-blue-200">{selectedCell.department}</p>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="p-1 hover:bg-white/20 rounded-md text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-lg font-bold text-slate-800">
                    {selectedCell.cell.employeeCount}
                  </div>
                  <div className="text-[10px] text-slate-500">Department Staff</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-lg font-bold text-blue-900">
                    {selectedCell.cell.averageScore}%
                  </div>
                  <div className="text-[10px] text-slate-500">Average Competency</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-lg font-bold text-emerald-700">
                    {selectedCell.cell.requiredScore}%
                  </div>
                  <div className="text-[10px] text-slate-500">Required Benchmark</div>
                </div>
              </div>

              {selectedCell.cell.gap > 0 ? (
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 flex items-center gap-2.5 text-rose-800">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    Identified Competency Gap of <strong>{selectedCell.cell.gap}%</strong> below department benchmark requirement.
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 font-medium">
                  ✓ Department meets or exceeds competency benchmark standards.
                </div>
              )}

              <div>
                <h5 className="font-bold text-slate-800 mb-2">Recommended Training Intervention:</h5>
                <div className="space-y-1.5">
                  {selectedCell.cell.recommendedCourses.length > 0 ? (
                    selectedCell.cell.recommendedCourses.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-200 text-slate-800 flex items-center justify-between"
                      >
                        <span className="font-semibold">{c}</span>
                        <Link
                          href="/admin/courses"
                          onClick={() => setSelectedCell(null)}
                          className="text-blue-900 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                        >
                          <span>Deploy Course</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No remedial course required.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedCell(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
