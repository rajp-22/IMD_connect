import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Award,
  FileCheck2,
  Clock,
  Sparkles,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Compass,
  GitFork,
  Brain,
  Calendar,
  FileBadge,
  CheckCircle2,
  AlertCircle,
  Play,
  ShieldCheck,
} from 'lucide-react';
import { getSessionUser } from '@/lib/auth';
import {
  getEnrollments,
  getCourses,
  getCertificates,
  getAssessments,
  getSkillGaps,
  getAnnouncements,
  getTraineeProfile,
  getSmartCourseRecommendations,
  getLearningPathByUserId,
  getEarlyLearningSupportSignal,
  getTrainingEvents,
} from '@/lib/data-service';
import CourseCard from '@/components/CourseCard';
import EarlySupportSignal from '@/components/EarlySupportSignal';

export const dynamic = 'force-dynamic';

export default async function TraineeDashboard() {
  const session = await getSessionUser();
  const userId = session?.id || 'usr_trainee_001';

  const [
    profile,
    enrollments,
    allCourses,
    certificates,
    assessments,
    skillGaps,
    announcements,
    recommendations,
    learningPath,
    earlySupport,
    trainingEvents,
  ] = await Promise.all([
    getTraineeProfile(userId),
    getEnrollments(userId),
    getCourses(),
    getCertificates(userId),
    getAssessments(),
    getSkillGaps(userId),
    getAnnouncements(),
    getSmartCourseRecommendations(userId),
    getLearningPathByUserId(userId),
    getEarlyLearningSupportSignal(userId),
    getTrainingEvents(userId, 'trainee'),
  ]);

  const enrolledCount = enrollments.length;
  const inProgressEnrollments = enrollments.filter(
    (e) => e.status === 'in-progress' || (e.progressPercentage > 0 && e.progressPercentage < 100)
  );
  const inProgressCount = inProgressEnrollments.length;
  const completedCount = enrollments.filter((e) => e.status === 'completed').length;
  const certCount = certificates.length;

  let profileScore = 40;
  if (profile?.education && profile.education.length > 0) profileScore += 20;
  if (profile?.experience && profile.experience.length > 0) profileScore += 20;
  if (profile?.skills && profile.skills.length > 0) profileScore += 20;
  const profileCompletion = Math.min(100, profileScore);

  const enrolledCourseIds = enrollments.map((e) => e.courseId);
  const enrolledCourses = allCourses.filter((c) => enrolledCourseIds.includes(c._id));

  // Primary active course for Continue Learning spotlight
  const activeCourse = enrolledCourses.find((c) => {
    const enr = enrollments.find((e) => e.courseId === c._id);
    return enr && enr.status === 'in-progress';
  }) || enrolledCourses[0];

  const activeEnrollment = activeCourse
    ? enrollments.find((e) => e.courseId === activeCourse._id)
    : null;

  return (
    <div className="space-y-8">
      {/* 0. Welcome & Institutional Identity Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden border border-blue-900/50">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-900/80 border border-blue-700/60 text-xs font-semibold text-amber-300 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Trainee Learning Terminal • RMC Mumbai</span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white leading-[1.2]">
            Welcome back, {session?.name || 'Pooja Iyer'}
          </h1>
          <p className="text-sm sm:text-[15px] text-blue-200 mt-2.5 font-normal leading-[1.5]">
            Your personalized capacity development dashboard: manage active training modules, analyze your operational competency gaps, and prepare for certified meteorological evaluations.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-5">
            <Link
              href="/trainee/courses"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-blue-950 text-sm font-semibold rounded-lg shadow-xs flex items-center gap-2 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Continue Learning</span>
            </Link>
            <Link
              href="/trainee/learning-path"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg border border-white/20 flex items-center gap-2 transition backdrop-blur-xs"
            >
              <GitFork className="w-4 h-4 text-amber-300" />
              <span>Learning Path</span>
            </Link>
            <Link
              href="/trainee/passport"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg border border-white/20 flex items-center gap-2 transition backdrop-blur-xs"
            >
              <FileBadge className="w-4 h-4 text-amber-300" />
              <span>Competency Passport</span>
            </Link>
            <Link
              href="/trainee/ai"
              className="px-4 py-2 bg-blue-800/70 hover:bg-blue-800 text-blue-100 text-sm font-semibold rounded-lg border border-blue-600/50 flex items-center gap-2 transition"
            >
              <Brain className="w-4 h-4 text-blue-300" />
              <span>MeghSetu AI</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Early Learning Support Signal if applicable */}
      {earlySupport && earlySupport.needsSupport && (
        <EarlySupportSignal
          needsSupport={earlySupport.needsSupport}
          recentScores={earlySupport.recentScores}
          guidanceMessage={earlySupport.guidanceMessage}
        />
      )}

      {/* Quick Overview KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Link
          href="/trainee/courses"
          className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Active</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-[28px] sm:text-[30px] font-bold text-amber-700 leading-none">{inProgressCount}</div>
            <p className="text-xs text-slate-500 font-normal mt-1.5">In Progress</p>
          </div>
        </Link>

        <Link
          href="/trainee/courses"
          className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Completed</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-[28px] sm:text-[30px] font-bold text-emerald-700 leading-none">{completedCount}</div>
            <p className="text-xs text-slate-500 font-normal mt-1.5">Courses Mastered</p>
          </div>
        </Link>

        <Link
          href="/trainee/competencies"
          className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Skill Gaps</span>
            <Compass className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="text-[28px] sm:text-[30px] font-bold text-rose-700 leading-none">
              {skillGaps.filter((g) => g.gap > 0).length}
            </div>
            <p className="text-xs text-slate-500 font-normal mt-1.5">Target Deficits</p>
          </div>
        </Link>

        <Link
          href="/trainee/assessments"
          className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Exams</span>
            <FileCheck2 className="w-4 h-4 text-blue-900" />
          </div>
          <div>
            <div className="text-[28px] sm:text-[30px] font-bold text-blue-900 leading-none">{assessments.length}</div>
            <p className="text-xs text-slate-500 font-normal mt-1.5">Available Tests</p>
          </div>
        </Link>

        <Link
          href="/trainee/certificates"
          className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Certificates</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-[28px] sm:text-[30px] font-bold text-purple-700 leading-none">{certCount}</div>
            <p className="text-xs text-slate-500 font-normal mt-1.5">QR Verified</p>
          </div>
        </Link>

        <Link
          href="/trainee/profile"
          className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Profile</span>
            <UserCheck className="w-4 h-4 text-blue-900" />
          </div>
          <div>
            <div className="text-[28px] sm:text-[30px] font-bold text-slate-900 leading-none">{profileCompletion}%</div>
            <p className="text-xs text-slate-500 font-normal mt-1.5">Profile Complete</p>
          </div>
        </Link>
      </div>

      {/* CENTRALIZED SCHEDULE & UPCOMING DEADLINES INTEGRATION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Schedule Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-900" />
              <h3 className="font-bold text-sm text-slate-900">Today's Schedule</h3>
            </div>
            <Link
              href="/trainee/calendar"
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
            >
              <span>Full Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {trainingEvents.filter((e) => e.date === '2026-09-29' || e.date === '2026-09-30').length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No live classes scheduled for today.</p>
            ) : (
              trainingEvents
                .filter((e) => e.date === '2026-09-29' || e.date === '2026-09-30')
                .slice(0, 2)
                .map((ev) => (
                  <div
                    key={ev._id}
                    className="p-3 rounded-lg bg-blue-50/50 border border-blue-200/70 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block line-clamp-1">{ev.title}</span>
                      <span className="text-[11px] text-slate-600 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-blue-900" /> {ev.time || '10:00 AM'}
                      </span>
                    </div>
                    <Link
                      href="/trainee/calendar"
                      className="px-2.5 py-1 bg-blue-900 text-white font-semibold rounded text-[11px] shrink-0"
                    >
                      Join / View
                    </Link>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Upcoming Deadlines Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-sm text-slate-900">Upcoming Deadlines</h3>
            </div>
            <Link
              href="/trainee/calendar"
              className="text-xs font-semibold text-orange-900 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {trainingEvents
              .filter((e) => ['DEADLINE', 'ASSIGNMENT', 'ASSESSMENT', 'EXAM', 'assessment_deadline'].includes(e.type))
              .slice(0, 2)
              .map((ev) => (
                <div
                  key={ev._id}
                  className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/70 flex items-center justify-between gap-3 text-xs border-l-4 border-l-amber-500"
                >
                  <div>
                    <span className="font-bold text-slate-900 block line-clamp-1">{ev.title}</span>
                    <span className="text-[11px] text-amber-900 font-medium block mt-0.5">
                      Due: {ev.date} • {ev.time?.split('–')[0] || '11:59 PM'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                    {ev.status || 'Upcoming'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* PRIORITY 1: CONTINUE LEARNING (Spotlight Hero + Enrolled Courses) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />
            <h2 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-[1.3] tracking-tight">1. Continue Learning</h2>
          </div>
          <Link
            href="/trainee/courses"
            className="text-sm font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>View all enrolled ({enrolledCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeCourse && activeEnrollment ? (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="relative w-full sm:w-44 h-28 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={activeCourse.thumbnail}
                    alt={activeCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-xs font-mono font-bold text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded">
                    {activeCourse.category.substring(0, 18)}...
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="badge-status-active text-xs font-semibold">Current Active Course</span>
                    <span className="text-xs text-slate-500 font-normal">
                      Trainer: {activeCourse.trainerName}
                    </span>
                  </div>
                  <h3 className="text-[17px] sm:text-[18px] font-semibold text-slate-900 leading-snug">
                    {activeCourse.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 max-w-xl font-normal leading-[1.5]">
                    {activeCourse.description}
                  </p>
                  <div className="text-xs text-slate-500 font-normal flex items-center gap-3 pt-1">
                    <span>Duration: <strong className="font-semibold text-slate-700">{activeCourse.duration}</strong></span>
                    <span>•</span>
                    <span>Difficulty: <strong className="font-semibold text-slate-700">{activeCourse.difficulty}</strong></span>
                  </div>
                </div>
              </div>

              <div className="lg:w-72 shrink-0 p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Course Progress</span>
                  <span className="font-mono font-bold text-blue-900 text-sm">
                    {activeEnrollment.progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-900 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${activeEnrollment.progressPercentage}%` }}
                  />
                </div>
                <Link
                  href={`/courses/${activeCourse._id}`}
                  className="w-full btn-primary py-2 text-sm font-semibold"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Course</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No active course in progress</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4 font-normal leading-[1.5]">
              Explore our structured meteorological curriculum to start learning and closing your competency gaps.
            </p>
            <Link href="/courses" className="btn-primary text-sm font-semibold">
              Explore Course Catalog
            </Link>
          </div>
        )}
      </section>

      {/* PRIORITY 2: RECOMMENDED COURSES (Smart recommendations with "Why") */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-900" />
            <h2 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-[1.3] tracking-tight">2. Recommended Courses</h2>
          </div>
          <span className="text-xs sm:text-[13px] text-slate-500 font-medium hidden sm:inline">
            Ranked by Competency Gap & Role Alignment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 3).map((rec) => (
            <div
              key={rec.course._id}
              className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="h-36 overflow-hidden relative bg-slate-900">
                  <img
                    src={rec.course.thumbnail}
                    alt={rec.course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-blue-950/90 text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-700/50">
                    {rec.matchScore}% Match
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                      {rec.course.category}
                    </span>
                    <h3 className="font-semibold text-[16px] text-slate-900 mt-2 line-clamp-1 leading-snug">
                      {rec.course.title}
                    </h3>
                  </div>

                  {/* Transparent "WHY" Section */}
                  <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200/60 space-y-1">
                    <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-950">
                      Why Recommended for you?
                    </div>
                    {rec.reasons.map((r, ri) => (
                      <div key={ri} className="text-xs text-slate-700 font-normal flex items-start gap-1">
                        <span className="text-emerald-700 shrink-0 font-bold">✓</span>
                        <span>{r.replace(/^✓\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/courses/${rec.course.slug || rec.course._id}`}
                  className="w-full btn-secondary py-2 text-sm font-semibold text-blue-900 hover:text-blue-950 hover:border-blue-300"
                >
                  <span>Explore Course & Syllabus</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRIORITY 3: SKILL GAPS (Immediate Understanding: Current vs Required & Recommended Action) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-rose-600" />
            <h2 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-[1.3] tracking-tight">3. Skill Gaps</h2>
          </div>
          <Link
            href="/trainee/competencies"
            className="text-sm font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Complete analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillGaps
            .filter((g) => g.gap > 0)
            .slice(0, 4)
            .map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-base text-slate-900">{item.competencyName}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase font-mono ${
                        item.status === 'Critical'
                          ? 'badge-status-error'
                          : 'badge-status-pending'
                      }`}
                    >
                      Gap: {item.gap}%
                    </span>
                  </div>

                  {/* Current vs Required Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 bg-slate-50 rounded-lg border border-slate-200/70 mb-3">
                    <div>
                      <span className="text-[11px] sm:text-xs text-slate-500 uppercase font-semibold block">
                        Current Level
                      </span>
                      <span className="text-[20px] font-bold font-mono text-slate-900">
                        {item.currentScore}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] sm:text-xs text-slate-500 uppercase font-semibold block">
                        Required Benchmark
                      </span>
                      <span className="text-[20px] font-bold font-mono text-blue-900">
                        {item.requiredScore}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Comparison Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-blue-900 h-2 rounded-l-full"
                        style={{ width: `${item.currentScore}%` }}
                      />
                      <div
                        className="bg-rose-400 h-2 rounded-r-full"
                        style={{ width: `${item.gap}%` }}
                      />
                    </div>
                  </div>
                </div>

                {item.recommendedCourses && item.recommendedCourses.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="truncate text-xs text-slate-600">
                      <span className="text-[11px] text-slate-500 block uppercase font-semibold">
                        Remedial Recommendation
                      </span>
                      <span className="font-medium text-sm text-slate-900 truncate block">
                        {item.recommendedCourses[0].title}
                      </span>
                    </div>
                    <Link
                      href={`/courses/${item.recommendedCourses[0].id}`}
                      className="btn-primary py-1.5 px-3.5 text-xs font-semibold shrink-0"
                    >
                      <span>Start Learning</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
        </div>
      </section>

      {/* PRIORITY 4: COMPETENCY PROGRESS & LEARNING PATH JOURNEY */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-blue-900" />
            <h2 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-[1.3] tracking-tight">
              4. Competency Progress & Learning Path
            </h2>
          </div>
          <Link
            href="/trainee/learning-path"
            className="text-sm font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Full learning path sequence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {learningPath && (
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-slate-900">{learningPath.title}</span>
                <span className="text-xs bg-blue-100 text-blue-900 font-semibold px-2.5 py-0.5 rounded-full">
                  Step {learningPath.currentStep} of {learningPath.steps.length}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-normal leading-[1.5]">
                Target Role: <strong className="font-semibold text-slate-800">{learningPath.targetRole}</strong> • Next milestone: <strong className="font-semibold text-blue-900">{learningPath.nextRecommendedStep}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-36 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-900 h-full rounded-full transition-all duration-500"
                  style={{ width: `${learningPath.progress}%` }}
                />
              </div>
              <span className="font-mono text-sm font-bold text-blue-900">
                {learningPath.progress}%
              </span>
              <Link
                href="/trainee/learning-path"
                className="btn-primary py-2 px-4 text-sm font-semibold"
              >
                Continue Journey
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* PRIORITY 5: UPCOMING ASSESSMENTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-900" />
            <h2 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-[1.3] tracking-tight">5. Upcoming Assessments</h2>
          </div>
          <Link
            href="/trainee/assessments"
            className="text-sm font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>All assessments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.slice(0, 2).map((asm) => (
            <div
              key={asm._id}
              className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono uppercase font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                    {asm.assessmentType === 'pre' ? 'Diagnostic Pre-Test' : 'Certification Exam'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-normal">
                    {asm.durationMinutes} mins • {asm.totalMarks} marks
                  </span>
                </div>
                <h3 className="font-semibold text-base text-slate-900 leading-snug">{asm.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mt-1.5 font-normal leading-[1.5]">{asm.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-normal">
                  Benchmark: <strong className="font-semibold text-slate-700">{asm.passingPercentage}%</strong> to pass
                </span>
                <Link
                  href="/trainee/assessments"
                  className="btn-secondary py-2 px-3.5 text-sm font-semibold text-blue-900 hover:text-blue-950"
                >
                  <span>Launch Exam</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRIORITY 6: CERTIFICATES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-700" />
            <h2 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-[1.3] tracking-tight">6. Verified Certificates</h2>
          </div>
          <Link
            href="/trainee/certificates"
            className="text-sm font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>View certificate vault ({certCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.slice(0, 2).map((cert) => (
              <div
                key={cert._id}
                className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="badge-status-completed text-xs font-semibold mb-2">QR Verified Credential</span>
                    <h3 className="font-semibold text-base text-slate-900 leading-snug">{cert.courseName}</h3>
                    <p className="text-xs text-slate-500 font-mono font-normal mt-1">
                      Certificate ID: {cert.certificateId}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-normal">Grade: <strong className="font-semibold text-slate-800">{cert.scorePercentage}%</strong></span>
                  <Link
                    href="/trainee/certificates"
                    className="btn-secondary py-2 px-3.5 text-sm font-semibold text-purple-900 hover:text-purple-950"
                  >
                    <span>View Certificate</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500">
            <Award className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
            <p className="text-sm font-semibold text-slate-700">No certificates earned yet</p>
            <p className="text-xs text-slate-500 mt-1 font-normal leading-[1.5]">
              Complete course modules and score above the benchmark on final evaluations to receive official QR-verified credentials.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
