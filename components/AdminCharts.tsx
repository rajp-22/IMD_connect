'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface AdminChartsProps {
  monthlyTrends: { month: string; enrollments: number; completions: number }[];
  roleDistribution: { name: string; value: number; color: string }[];
  competencyAverages: { domain: string; average: number; benchmark: number }[];
  coursePopularity?: { name: string; enrolled: number; rating: number }[];
}

const chartTooltipStyle = {
  backgroundColor: '#0b2545',
  border: '1px solid #1e3a8a',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

export default function AdminCharts({
  monthlyTrends,
  roleDistribution,
  competencyAverages,
  coursePopularity,
}: AdminChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Enrollments & Completions Trend */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 font-serif">
            Monthly Participation & Completion Trends
          </h3>
          <p className="text-[11px] text-slate-500">
            Cadre officer enrollment volumes vs official course graduations
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="enrollments" name="New Enrollments" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completions" name="Completed Graduations" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Role Distribution Donut Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 font-serif">Platform User Distribution</h3>
          <p className="text-[11px] text-slate-500">
            Composition of Trainees, Certified Instructors, and System Administrators
          </p>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name || ''} ${(((percent || 0) * 100)).toFixed(0)}%`
                }
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competency Benchmarks vs Trainee Averages */}
      <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 font-serif">
            Departmental Competency Averages vs Benchmark Standards
          </h3>
          <p className="text-[11px] text-slate-500">
            Department-wide competency levels aggregated across all operational cadres
          </p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={competencyAverages}>
              <XAxis dataKey="domain" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={45} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} axisLine={{ stroke: '#cbd5e1' }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="average" name="Cadre Average Score (%)" fill="#0b2545" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" name="Required Standard (%)" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
