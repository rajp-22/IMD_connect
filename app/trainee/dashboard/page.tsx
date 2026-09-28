import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Award,
  FileCheck2,
  Clock,
  Sparkles,
  Megaphone,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Compass,
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
} from '@/lib/data-service';
import CourseCard from '@/components/CourseCard';

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
  ] = await Promise.all([
    getTraineeProfile(userId),
    getEnrollments(userId),
    getCourses(),
    getCertificates(userId),
    getAssessments(),
    getSkillGaps(userId),
    getAnnouncements(),
  ]);

  // Metric Computations
  const enrolledCount = enrollments.length;
  const inProgressCount = enrollments.filter(
    (e) => e.status === 'in-progress' || (e.progressPercentage > 0 && e.progressPercentage < 100)
  ).length;
  const completedCount = enrollments.filter((e) => e.status === 'completed').length;
  const certCount = certificates.length;

  // Profile completion calculation
  let profileScore = 40; // baseline from account creation
  if (profile?.education && profile.education.length > 0) profileScore += 20;
  if (profile?.experience && profile.experience.length > 0) profileScore += 20;
  if (profile?.skills && profile.skills.length > 0) profileScore += 20;
  const profileCompletion = Math.min(100, profileScore);

  // In-progress courses to continue
  const enrolledCourseIds = enrollments.map((e) => e.courseId);
  const enrolledCourses = allCourses.filter((c) => enrolledCourseIds.includes(c._id));

  // Courses recommended from actual skill gaps
  const recommendedCourseIds = Array.from(
    new Set(skillGaps.flatMap((g) => g.recommendedCourseIds))
  );
  const recommendedCourses = allCourses.filter(
    (c) => recommendedCourseIds.includes(c._id) && !enrolledCourseIds.includes(c._id)
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-800/70 border border-blue-600/50 text-[11px] font-semibold text-amber-300 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Trainee Learning Terminal • RMC Mumbai</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Welcome back, {session?.name || 'Pooja Iyer'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-2 leading-relaxed">
            Track your ongoing atmospheric meteorology modules, review automated skill gaps, and
            progress toward national operational forecasting credentials.
          </p>
        </div>
      </div>

      {/* Top 6 Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Profile Completion */}
        <Link
          href="/trainee/profile"
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
            <UserCheck className="w-4 h-4 text-blue-800" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-slate-900">{profileCompletion}%</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Completion Rate</p>
          </div>
        </Link>

        {/* Enrolled Courses */}
        <Link
          href="/trainee/courses"
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Enrolled</span>
            <BookOpen className="w-4 h-4 text-blue-800" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-slate-900">{enrolledCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Total Enrolled</p>
          </div>
        </Link>

        {/* In Progress */}
        <Link
          href="/trainee/courses"
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-amber-700">{inProgressCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Active Modules</p>
          </div>
        </Link>

        {/* Completed */}
        <Link
          href="/trainee/courses"
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
            <GraduationCap className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-emerald-700">{completedCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Completed Courses</p>
          </div>
        </Link>

        {/* Certificates */}
        <Link
          href="/trainee/certificates"
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Certificates</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-slate-900">{certCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Verified Credentials</p>
          </div>
        </Link>

        {/* Upcoming Assessments */}
        <Link
          href="/trainee/assessments"
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Assessments</span>
            <FileCheck2 className="w-4 h-4 text-purple-700" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-purple-700">
              {assessments.length}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Available Exams</p>
          </div>
        </Link>
      </div>

      {/* Continue Learning Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">Continue Learning</h2>
            <p className="text-xs text-slate-500">Pick up right where you left off</p>
          </div>
          <Link
            href="/trainee/courses"
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Enrolled ({enrolledCourses.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((c) => {
              const enr = enrollments.find((e) => e.courseId === c._id);
              return <CourseCard key={c._id} course={c} enrollment={enr} />;
            })}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No active courses enrolled yet.{' '}
            <Link href="/courses" className="text-blue-900 font-bold hover:underline">
              Browse Course Catalog
            </Link>
          </div>
        )}
      </section>

      {/* Recommended Training Based on Stored Skill Gaps */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                Recommended Training (Targeted for Your Skill Gaps)
              </h2>
              <p className="text-xs text-slate-500">
                Identified based on your competency levels and IMD operational benchmarks
              </p>
            </div>
          </div>
          <Link
            href="/trainee/competencies"
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Skill Gap Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.length > 0 ? (
            recommendedCourses.map((c) => <CourseCard key={c._id} course={c} />)
          ) : (
            <div className="col-span-3 p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              You are currently enrolled in all recommended courses for your current competency gaps!
            </div>
          )}
        </div>
      </section>

      {/* Recent IMD Announcements Strip */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900">
              Official IMD Training Announcements
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">IMD Directorate HQ</span>
        </div>

        <div className="space-y-3">
          {announcements.slice(0, 2).map((ann) => (
            <div
              key={ann._id}
              className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">{ann.title}</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(ann.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{ann.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
