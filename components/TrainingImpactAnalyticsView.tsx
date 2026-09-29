'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
  Filter,
  ArrowUpRight,
  BookOpen,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ITrainingImpactMetrics } from '@/lib/types';

interface TrainingImpactAnalyticsViewProps {
  metrics: ITrainingImpactMetrics;
}

export default function TrainingImpactAnalyticsView({
  metrics,
}: TrainingImpactAnalyticsViewProps) {
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');

  // Chart data preparing Pre vs Post scores
  const chartData = metrics.courseBreakdown.map((c) => ({
    name: c.courseTitle.length > 20 ? c.courseTitle.substring(0, 18) + '...' : c.courseTitle,
    'Pre-Test': c.preAvg,
    'Post-Test': c.postAvg,
    Improvement: c.improvement,
  }));

  return (
    <div className="space-y-6">
      {/* Top Disclaimer Alert Banner */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-900">
        <AlertCircle className="w-5 h-5 text-blue-800 shrink-0" />
        <span>
          <strong>Methodological Notice:</strong> {metrics.disclaimer}
        </span>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pre vs Post Average Improvement */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Average Improvement</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">
            +{metrics.averageImprovement} pts
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
            <span>Pre: {metrics.averagePreTestScore}%</span>
            <span>→</span>
            <span className="font-bold text-slate-800">Post: {metrics.averagePostTestScore}%</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Course Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-3xl font-extrabold text-blue-900 font-mono">
            {metrics.completionRate}%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium pt-1">
            ↑ 8.2% compared to baseline year
          </div>
        </div>

        {/* Total Learning Hours */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Learning Hours</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-purple-700 font-mono">
            {metrics.totalLearningHours.toLocaleString()} hrs
          </div>
          <div className="text-[11px] text-slate-500 pt-1">
            Across 20 regional stations
          </div>
        </div>

        {/* Course Engagement Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Course Engagement</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono">
            {metrics.courseEngagementRate}%
          </div>
          <div className="text-[11px] text-slate-500 pt-1">
            Weekly active trainees
          </div>
        </div>
      </div>

      {/* Visual Pre-Test vs Post-Test Comparison Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pre-Assessment vs Post-Assessment Outcome Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Direct metric demonstrating baseline knowledge versus post-training certification mastery.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
              Average Net Delta: +{metrics.averageImprovement} percentage points
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b2545',
                  border: '1px solid #1e3a8a',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Pre-Test" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Post-Test" fill="#0b2545" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course & Department Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Course */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="w-4 h-4 text-blue-900" />
            <h4 className="text-sm font-bold text-slate-900">Impact by Course Curriculum</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase">
                  <th className="py-2">Course</th>
                  <th className="py-2 text-center">Pre</th>
                  <th className="py-2 text-center">Post</th>
                  <th className="py-2 text-center">Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.courseBreakdown.map((c) => (
                  <tr key={c.courseId} className="hover:bg-slate-50">
                    <td className="py-2.5 font-medium text-slate-800 pr-2 truncate max-w-[200px]">
                      {c.courseTitle}
                    </td>
                    <td className="py-2.5 text-center text-slate-500 font-mono">{c.preAvg}%</td>
                    <td className="py-2.5 text-center text-blue-900 font-bold font-mono">
                      {c.postAvg}%
                    </td>
                    <td className="py-2.5 text-center text-emerald-600 font-bold font-mono">
                      +{c.improvement} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* By Department */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-blue-900" />
            <h4 className="text-sm font-bold text-slate-900">Impact by Operational Department</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase">
                  <th className="py-2">Department</th>
                  <th className="py-2 text-center">Pre</th>
                  <th className="py-2 text-center">Post</th>
                  <th className="py-2 text-center">Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.departmentBreakdown.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 font-medium text-slate-800 pr-2 truncate max-w-[220px]">
                      {d.department}
                    </td>
                    <td className="py-2.5 text-center text-slate-500 font-mono">{d.preAvg}%</td>
                    <td className="py-2.5 text-center text-blue-900 font-bold font-mono">
                      {d.postAvg}%
                    </td>
                    <td className="py-2.5 text-center text-emerald-600 font-bold font-mono">
                      +{d.improvement} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
