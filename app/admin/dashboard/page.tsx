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
  Sparkles,
  Building2,
  Compass,
} from 'lucide-react';
import { getAdminDashboardMetrics, getCourses, getTrainingEvents } from '@/lib/data-service';
import AdminCharts from '@/components/AdminCharts';
import PendingUsersTable from '@/components/PendingUsersTable';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [metrics, allCourses, calendarEvents] = await Promise.all([
    getAdminDashboardMetrics(),
    getCourses(),
    getTrainingEvents(undefined, 'admin'),
  ]);

  const { cards } = metrics;

  return (
    <div className="space-y-8">
      {/* 1. ORGANIZATION OVERVIEW */}
      <section className="space-y-4">
        {/* Directorate Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-900/40">
          <div>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-400/30 inline-flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Directorate General of Meteorology • IMD HQ New Delhi</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
              National Capacity Command Center
            </h1>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl leading-relaxed">
              Institutional intelligence & workforce readiness portal: evaluate national meteorological skill coverage, verify training outcomes, and orchestrate expert faculty matching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/heatmap"
              className="btn-secondary py-2 px-3 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Grid3X3 className="w-3.5 h-3.5 text-blue-300" />
              <span>Skill Heatmap</span>
            </Link>
            <Link
              href="/admin/training-impact"
              className="btn-secondary py-2 px-3 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Training Impact</span>
            </Link>
            <Link
              href="/admin/trainer-matching"
              className="btn-secondary py-2 px-3 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Target className="w-3.5 h-3.5 text-amber-300" />
              <span>Trainer Match</span>
            </Link>
          </div>
        </div>

        {/* Executive Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">Stations Active</span>
              <Building2 className="w-4 h-4 text-blue-900" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">20 Stations</div>
            <p className="text-[10px] text-slate-400">All 6 Regional Centres</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Personnel</span>
              <Users className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">{cards.totalUsers}</div>
            <p className="text-[10px] text-slate-400">Trainees, Faculty & Admin</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">Competency Index</span>
              <Compass className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-blue-900">76.4%</div>
            <p className="text-[10px] text-emerald-700 font-medium">Above national benchmark</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">Pending Action</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-700">
              {cards.pendingApprovalsCount}
            </div>
            <p className="text-[10px] text-slate-400">Awaiting Sanction</p>
          </div>
        </div>
      </section>

      {/* 2. TRAINING STATISTICS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />
            <h2 className="text-lg font-bold text-slate-900 font-serif">2. Training Statistics</h2>
          </div>
          <Link
            href="/admin/analytics"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Detailed platform metrics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Users</span>
            <div className="text-xl font-bold font-mono text-slate-900">{cards.totalUsers}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Officers & Staff</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Trainees</span>
            <div className="text-xl font-bold font-mono text-blue-900">{cards.traineesCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Operational Cadre</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Faculty</span>
            <div className="text-xl font-bold font-mono text-emerald-700">{cards.trainersCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Certified Trainers</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Courses</span>
            <div className="text-xl font-bold font-mono text-slate-900">{cards.totalCourses}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Active Programs</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Enrollments</span>
            <div className="text-xl font-bold font-mono text-amber-700">{cards.activeEnrollments}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">In Training</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Certificates</span>
            <div className="text-xl font-bold font-mono text-purple-700">{cards.certificatesIssued}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">QR Verified</p>
          </div>
        </div>
      </section>

      {/* 2.5 CENTRALIZED ORGANIZATION CALENDAR & EVENT INTELLIGENCE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              National Organization Calendar & Schedule Management
            </h2>
          </div>
          <Link
            href="/admin/calendar"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Launch Central Calendar Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Organization Calendar Quick View */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Organization Calendar</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                {calendarEvents.length} Active Events
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Synchronized cross-domain events for all trainees, faculty trainers, and HQ divisions.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/calendar"
                className="w-full btn-secondary py-1.5 text-xs font-semibold text-blue-900 flex items-center justify-center gap-1"
              >
                <span>Manage Global Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Upcoming Events</span>
              <span className="text-[10px] text-slate-400 font-mono">Next 14 Days</span>
            </div>
            <div className="space-y-2">
              {calendarEvents.slice(0, 2).map((ev) => (
                <div key={ev._id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-bold text-slate-900 block line-clamp-1">{ev.title}</span>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                    <span>{ev.date}</span>
                    <span className="font-semibold text-blue-900">{ev.time?.split('–')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Conflicts */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-emerald-600" />
                Schedule Conflicts
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                0 Active Conflicts
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Conflict detection active: No overlapping trainer hall reservations or conflicting exam dates detected.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/calendar"
                className="w-full btn-secondary py-1.5 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1"
              >
                <span>View Conflict Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPETENCY INSIGHTS & CAPACITY CHARTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900 font-serif">3. Competency Insights</h2>
          </div>
          <Link
            href="/admin/competencies"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Framework standards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AdminCharts
          monthlyTrends={metrics.monthlyTrends}
          coursePopularity={metrics.coursePopularity}
          roleDistribution={metrics.roleDistribution}
          competencyAverages={metrics.competencyAverages}
        />
      </section>

      {/* 4. SKILL HEATMAP PREVIEW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900 font-serif">4. Skill Heatmap Overview</h2>
          </div>
          <Link
            href="/admin/heatmap"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Open full matrix view</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900">
              Departmental Competency Distribution & Regional Deficit Matrix
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl">
              Cross-station evaluation comparing RMC Mumbai, RMC Delhi, RMC Kolkata, and RMC Chennai across NWP, Radar, Synoptic, and Satellite competencies.
            </p>
          </div>
          <Link
            href="/admin/heatmap"
            className="btn-primary py-2 px-4 text-xs shrink-0 self-start md:self-center"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Launch Interactive Heatmap</span>
          </Link>
        </div>
      </section>

      {/* 5. TRAINING IMPACT & OUTCOMES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              5. Training Impact & Learning Outcomes
            </h2>
          </div>
          <Link
            href="/admin/training-impact"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Detailed impact report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500">Average Pre-Test Score</span>
            <div className="text-2xl font-bold font-mono text-slate-700">
              {cards.averagePreTestScore}%
            </div>
            <p className="text-[10px] text-slate-400">Baseline incoming diagnostic</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500">Average Post-Test Score</span>
            <div className="text-2xl font-bold font-mono text-blue-900">
              {cards.averagePostTestScore}%
            </div>
            <p className="text-[10px] text-slate-400">Graduation certification exam</p>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 shadow-2xs space-y-1">
            <span className="text-xs text-emerald-800 font-semibold">Average Net Gain</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-700">
              +{cards.averageImprovement} pts
            </div>
            <p className="text-[10px] text-emerald-700 font-medium">Empirical learning gain</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500">Total Learning Hours</span>
            <div className="text-2xl font-bold font-mono text-purple-700">
              {cards.totalLearningHours.toLocaleString()} hrs
            </div>
            <p className="text-[10px] text-slate-400">National capacity accumulated</p>
          </div>
        </div>
      </section>

      {/* 6. RECENT ACTIVITY & INSTITUTIONAL ACTIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              6. Recent Activity & Personnel Sanctions
            </h2>
          </div>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-200">
            {cards.pendingApprovalsCount} Action Required
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pending Faculty & Cadre Approvals
              </h3>
              <p className="text-xs text-slate-500">
                Verify and sanction applicant credentials before allowing access to course creation or examinations.
              </p>
            </div>
            <Link
              href="/admin/users"
              className="btn-secondary py-1.5 px-3 text-xs"
            >
              All User Records
            </Link>
          </div>

          <PendingUsersTable pendingUsers={metrics.pendingUsers} />
        </div>
      </section>
    </div>
  );
}
