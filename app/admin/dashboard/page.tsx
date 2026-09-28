import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  BarChart3,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { getAdminDashboardMetrics, getCourses } from '@/lib/data-service';
import AdminCharts from '@/components/AdminCharts';
import PendingUsersTable from '@/components/PendingUsersTable';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [metrics, allCourses] = await Promise.all([
    getAdminDashboardMetrics(),
    getCourses(),
  ]);

  const { cards } = metrics;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-amber-900/90 text-amber-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-700/50">
            Directorate General of Meteorology • IMD HQ
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif mt-2">
            Central Administrative Analytics & Governance
          </h1>
          <p className="text-xs text-blue-200 mt-1">
            Institutional oversight of organizational capacity building, personnel certifications,
            and national training curricula.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/announcements"
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            Broadcast Announcement
          </Link>
        </div>
      </div>

      {/* 8 Government Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total Users */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Total Cadre
          </span>
          <div className="text-lg font-bold font-mono text-slate-900">{cards.totalUsers}</div>
          <p className="text-[9px] text-slate-400 mt-0.5">Officers</p>
        </div>

        {/* Trainees */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Trainees
          </span>
          <div className="text-lg font-bold font-mono text-blue-800">{cards.traineesCount}</div>
          <p className="text-[9px] text-slate-400 mt-0.5">Learners</p>
        </div>

        {/* Trainers */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Trainers
          </span>
          <div className="text-lg font-bold font-mono text-emerald-700">{cards.trainersCount}</div>
          <p className="text-[9px] text-slate-400 mt-0.5">Faculty</p>
        </div>

        {/* Pending Approvals */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Approvals
          </span>
          <div className="text-lg font-bold font-mono text-amber-700">
            {cards.pendingApprovalsCount}
          </div>
          <p className="text-[9px] text-amber-600 font-semibold mt-0.5">Requires Action</p>
        </div>

        {/* Courses */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Courses
          </span>
          <div className="text-lg font-bold font-mono text-slate-900">{cards.totalCourses}</div>
          <p className="text-[9px] text-slate-400 mt-0.5">Curricula</p>
        </div>

        {/* Active Enrollments */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Enrolled
          </span>
          <div className="text-lg font-bold font-mono text-blue-800">
            {cards.activeEnrollments}
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5">Active</p>
        </div>

        {/* Completed */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Completed
          </span>
          <div className="text-lg font-bold font-mono text-emerald-700">
            {cards.completedCourses}
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5">Passed</p>
        </div>

        {/* Certificates Issued */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Certificates
          </span>
          <div className="text-lg font-bold font-mono text-amber-600">
            {cards.certificatesIssued}
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5">Issued</p>
        </div>
      </div>

      {/* Pending User Approvals Table (Requirement 16 & 17) */}
      <PendingUsersTable initialUsers={metrics.pendingUsers} />

      {/* Recharts Analytics Charts (Requirement 16) */}
      <AdminCharts
        monthlyTrends={metrics.monthlyTrends}
        roleDistribution={metrics.roleDistribution}
        competencyAverages={metrics.competencyAverages}
      />

      {/* Recent Certificates & Recent Courses Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Certificates */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Recently Issued Digital Certificates</span>
            </h3>
            <Link
              href="/admin/certificates"
              className="text-[11px] font-semibold text-blue-900 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {metrics.recentCertificates.map((cert) => (
              <div key={cert._id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{cert.traineeName}</div>
                  <div className="text-[11px] text-slate-500">{cert.courseName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {cert.certificateId}</div>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {cert.scorePercentage}%
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(cert.issueDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Curricula Roster */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-blue-900" />
              <span>Active Training Curricula</span>
            </h3>
            <Link
              href="/admin/courses"
              className="text-[11px] font-semibold text-blue-900 hover:underline"
            >
              Manage Courses
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {allCourses.map((c) => (
              <div key={c._id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{c.title}</div>
                  <div className="text-[11px] text-slate-500">
                    Trainer: {c.trainerName} • {c.difficulty}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-blue-900">{c.enrolledCount || 84} Enrolled</span>
                  <div className="text-[10px] text-amber-600 font-bold">{c.rating} ★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
