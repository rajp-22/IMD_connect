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
  TrendingUp,
  Grid3X3,
  Target,
  Bell,
  AlertTriangle,
  Shield,
  Layers,
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
      {/* Top Command Center Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-400/30">
            Directorate General of Meteorology • IMD HQ
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif mt-2">
            Admin Command Center (Feature 25)
          </h1>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl">
            Real-time organizational capacity intelligence: track departmental competency coverage, measure training improvement outcomes, and govern trainer deployment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/heatmap"
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Skill Heatmap</span>
          </Link>
          <Link
            href="/admin/training-impact"
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Training Impact</span>
          </Link>
          <Link
            href="/admin/trainer-matching"
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Trainer Matching</span>
          </Link>
        </div>
      </div>

      {/* SECTION 1: PLATFORM METRICS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-900" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Platform Metrics
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Users</span>
            <div className="text-xl font-bold font-mono text-slate-900">{cards.totalUsers}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Officers & Staff</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Trainees</span>
            <div className="text-xl font-bold font-mono text-blue-900">{cards.traineesCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">20 Stations</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Faculty</span>
            <div className="text-xl font-bold font-mono text-emerald-700">{cards.trainersCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Certified Trainers</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Courses</span>
            <div className="text-xl font-bold font-mono text-slate-900">{cards.totalCourses}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Curricula</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Enrollments</span>
            <div className="text-xl font-bold font-mono text-amber-700">{cards.activeEnrollments}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Active</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Certificates</span>
            <div className="text-xl font-bold font-mono text-purple-700">{cards.certificatesIssued}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">QR Verified</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: LEARNING OUTCOME METRICS (Feature 8) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Learning Outcome & Training Impact
            </h2>
          </div>
          <Link
            href="/admin/training-impact"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Detailed analytics</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500">Average Pre-Test Score</span>
            <div className="text-2xl font-bold font-mono text-slate-700">
              {cards.averagePreTestScore}%
            </div>
            <p className="text-[10px] text-slate-400">Baseline diagnostic</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500">Average Post-Test Score</span>
            <div className="text-2xl font-bold font-mono text-blue-900">
              {cards.averagePostTestScore}%
            </div>
            <p className="text-[10px] text-slate-400">Certification exam</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1 bg-emerald-50/40 border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold">Average Net Improvement</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-700">
              +{cards.averageImprovement} pts
            </div>
            <p className="text-[10px] text-emerald-700 font-medium">Empirical learning gain</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500">Total Learning Hours</span>
            <div className="text-2xl font-bold font-mono text-purple-700">
              {cards.totalLearningHours.toLocaleString()} hrs
            </div>
            <p className="text-[10px] text-slate-400">National capacity accumulated</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: ADMINISTRATIVE ALERTS (Demo Step 1!) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Institutional Alerts & Pending Actions
            </h2>
          </div>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
            {cards.pendingApprovalsCount} Action Required
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pending Trainer Approval (Demo Story Step 1)
              </h3>
              <p className="text-xs text-slate-500">
                Review and approve faculty credentials before they can publish new courses.
              </p>
            </div>
            <Link
              href="/admin/users"
              className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-blue-800 transition"
            >
              Review All Approvals
            </Link>
          </div>

          <PendingUsersTable pendingUsers={metrics.pendingUsers} />
        </div>
      </div>

      {/* SECTION 4: INSTITUTIONAL CHARTS & TRENDS */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Capacity Progression Charts
        </h2>
        <AdminCharts
          monthlyTrends={metrics.monthlyTrends}
          coursePopularity={metrics.coursePopularity}
          roleDistribution={metrics.roleDistribution}
          competencyAverages={metrics.competencyAverages}
        />
      </div>
    </div>
  );
}
