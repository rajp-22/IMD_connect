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
  GitFork,
  Brain,
  Calendar,
  FileBadge,
  CheckCircle2,
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
  ]);

  const enrolledCount = enrollments.length;
  const inProgressCount = enrollments.filter(
    (e) => e.status === 'in-progress' || (e.progressPercentage > 0 && e.progressPercentage < 100)
  ).length;
  const completedCount = enrollments.filter((e) => e.status === 'completed').length;
  const certCount = certificates.length;

  let profileScore = 40;
  if (profile?.education && profile.education.length > 0) profileScore += 20;
  if (profile?.experience && profile.experience.length > 0) profileScore += 20;
  if (profile?.skills && profile.skills.length > 0) profileScore += 20;
  const profileCompletion = Math.min(100, profileScore);

  const enrolledCourseIds = enrollments.map((e) => e.courseId);
  const enrolledCourses = allCourses.filter((c) => enrolledCourseIds.includes(c._id));

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
            Capacity Connect identifies your competency gaps, personalizes your learning sequence, and measures your progress toward operational forecasting credentials.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/trainee/learning-path"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-blue-950 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition"
            >
              <GitFork className="w-4 h-4" />
              <span>Personalized Learning Path</span>
            </Link>
            <Link
              href="/trainee/passport"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 flex items-center gap-1.5 transition backdrop-blur-xs"
            >
              <FileBadge className="w-4 h-4 text-amber-300" />
              <span>Competency Passport</span>
            </Link>
            <Link
              href="/trainee/ai"
              className="px-4 py-2 bg-blue-800/60 hover:bg-blue-800 text-blue-100 text-xs font-semibold rounded-lg border border-blue-600/50 flex items-center gap-1.5 transition"
            >
              <Brain className="w-4 h-4 text-blue-300" />
              <span>Capacity AI Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature 23: Early Learning Support Signal */}
      {earlySupport && earlySupport.needsSupport && (
        <EarlySupportSignal
          needsSupport={earlySupport.needsSupport}
          recentScores={earlySupport.recentScores}
          guidanceMessage={earlySupport.guidanceMessage}
        />
      )}

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
            <BookOpen className="w-4 h-4 text-blue-900" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-slate-900">{enrolledCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Total Registered</p>
          </div>
        </Link>

        {/* In Progress */}
        <Link
          href="/trainee/courses"
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-amber-700">{inProgressCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">In Progress</p>
          </div>
        </Link>

        {/* Completed */}
        <Link
          href="/trainee/courses"
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-emerald-700">{completedCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Courses Mastered</p>
          </div>
        </Link>

        {/* Certificates */}
        <Link
          href="/trainee/certificates"
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Certificates</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-purple-700">{certCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">QR Verified</p>
          </div>
        </Link>

        {/* Skill Gaps */}
        <Link
          href="/trainee/competencies"
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gaps</span>
            <Compass className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-rose-700">
              {skillGaps.filter((g) => g.gap > 0).length}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Target Gaps</p>
          </div>
        </Link>
      </div>

      {/* Feature 5: Smart Course Recommendations with transparent "WHY" Reasons */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              Smart Course Recommendations
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Ranked by Competency Gap & Role Alignment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 3).map((rec) => (
            <div
              key={rec.course._id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={rec.course.thumbnail}
                    alt={rec.course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-blue-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {rec.matchScore}% Match
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                      {rec.course.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">
                      {rec.course.title}
                    </h3>
                  </div>

                  {/* Transparent "WHY" Section (Feature 5) */}
                  <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200/60 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-950">
                      Why Recommended for you?
                    </div>
                    {rec.reasons.map((r, ri) => (
                      <div key={ri} className="text-[11px] text-slate-700 flex items-start gap-1">
                        <span className="text-emerald-700 shrink-0">✓</span>
                        <span>{r.replace(/^✓\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/courses/${rec.course.slug || rec.course._id}`}
                  className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition"
                >
                  <span>Explore Course & Pre-Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature 4: Learning Path Timeline Preview */}
      {learningPath && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitFork className="w-5 h-5 text-blue-900" />
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Your Learning Path Journey
              </h2>
            </div>
            <Link
              href="/trainee/learning-path"
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
            >
              <span>View full sequence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{learningPath.title}</span>
                <span className="text-[10px] bg-blue-100 text-blue-900 font-semibold px-2 py-0.2 rounded-full">
                  Step {learningPath.currentStep} of {learningPath.steps.length}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Next up: <strong className="text-slate-800">{learningPath.nextRecommendedStep}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-900 h-full rounded-full"
                  style={{ width: `${learningPath.progress}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-blue-900">
                {learningPath.progress}%
              </span>
              <Link
                href="/trainee/learning-path"
                className="px-3.5 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-blue-800 transition"
              >
                Continue
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* In-Progress Courses */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900 font-serif">In-Progress Courses</h2>
          </div>
          <Link
            href="/trainee/courses"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>View all enrolled</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => {
              const enr = enrollments.find((e) => e.courseId === course._id);
              return (
                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={true}
                  enrollmentProgress={enr?.progressPercentage}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            <p className="text-xs">You have not enrolled in any courses yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
