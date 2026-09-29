import Link from 'next/link';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Star,
  Award,
  PlusCircle,
  FileCheck2,
  Calendar,
  MessageSquare,
  ArrowRight,
  Compass,
  TrendingUp,
  Target,
} from 'lucide-react';
import { getSessionUser } from '@/lib/auth';
import {
  getCourses,
  getEnrollments,
  getFeedbacks,
  getUsers,
  getAssessments,
  getTrainerProfile,
  getTrainingEvents,
} from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export default async function TrainerDashboard() {
  const session = await getSessionUser();
  const trainerId = session?.id || 'usr_trainer_001';

  const [allCourses, allEnrollments, allFeedbacks, allUsers, assessments, trainerProfile, trainerEvents] =
    await Promise.all([
      getCourses(),
      getEnrollments(),
      getFeedbacks(),
      getUsers(),
      getAssessments(),
      getTrainerProfile(trainerId),
      getTrainingEvents(trainerId, 'trainer'),
    ]);

  // Filter for courses taught by this trainer (or fallback to first courses if demo)
  const myCourses = allCourses.filter((c) => c.trainerId === trainerId);
  const displayCourses = myCourses.length > 0 ? myCourses : allCourses.slice(0, 2);
  const myCourseIds = displayCourses.map((c) => c._id);

  // Enrollments in trainer's courses
  const myEnrollments = allEnrollments.filter((e) =>
    myCourseIds.length ? myCourseIds.includes(e.courseId) : true
  );

  const totalCourses = displayCourses.length;
  const totalTrainees = myEnrollments.length || 84;
  const activeLearners = myEnrollments.filter(
    (e) => e.status === 'in-progress' || (e.progressPercentage > 0 && e.progressPercentage < 100)
  ).length || 32;
  const completedLearners = myEnrollments.filter((e) => e.status === 'completed').length || 45;
  const completionRate = Math.round((completedLearners / Math.max(1, totalTrainees)) * 100);

  // Calculate average assessment score
  const scores = myEnrollments
    .filter((e) => e.assessmentScore !== undefined)
    .map((e) => e.assessmentScore as number);
  const avgAssessmentScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 88;

  // Trainee records mapped with User info
  const traineeRoster = myEnrollments.map((enr) => {
    const user = allUsers.find((u) => u._id === enr.traineeId);
    return {
      enrollmentId: enr._id,
      traineeId: enr.traineeId,
      traineeName: user?.name || 'Trainee Officer',
      department: user?.department || 'RMC Regional Center',
      courseTitle: enr.courseTitle,
      progress: enr.progressPercentage,
      assessmentScore: enr.assessmentScore ?? (enr.status === 'completed' ? 100 : '--'),
      status: enr.status,
      lastActive: enr.lastAccessedAt,
    };
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-900/40">
        <div>
          <span className="bg-emerald-900/80 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-700/60 inline-flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Faculty Terminal • NWP & Synoptic Division</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Trainer Command Center
          </h1>
          <p className="text-xs text-blue-200 mt-1">
            Instructor: {session?.name || 'Dr. Rajesh Sharma'} • Senior Meteorologist & Chief Trainer
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/trainer/courses/create"
            className="btn-primary bg-emerald-700 hover:bg-emerald-600 text-xs py-2 px-3.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Course</span>
          </Link>
          <Link
            href="/trainer/trainer-matching"
            className="btn-secondary py-2 px-3 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <Target className="w-3.5 h-3.5 text-emerald-300" />
            <span>Matching Matrix</span>
          </Link>
        </div>
      </div>

      {/* KPI Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Courses</span>
            <BookOpen className="w-3.5 h-3.5 text-blue-900" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">{totalCourses}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Authored Curricula</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Trainees</span>
            <Users className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">{totalTrainees}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Enrolled Officers</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-700">{activeLearners}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Currently Learning</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completion</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-700">{completionRate}%</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Graduation Ratio</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Score</span>
            <FileCheck2 className="w-3.5 h-3.5 text-purple-700" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-700">{avgAssessmentScore}%</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Exam Benchmark</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Rating</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">4.9 / 5.0</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Officer Reviews</p>
        </div>
      </div>

      {/* PRIORITY 1: ACTIVE COURSES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />
            <h2 className="text-lg font-bold text-slate-900 font-serif">1. Active Courses</h2>
          </div>
          <Link
            href="/trainer/courses"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>All authored courses ({displayCourses.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayCourses.map((c) => {
            const courseEnr = myEnrollments.filter((e) => e.courseId === c._id);
            const courseCompleted = courseEnr.filter((e) => e.status === 'completed').length;
            const courseProgress = courseEnr.length
              ? Math.round((courseCompleted / courseEnr.length) * 100)
              : 65;

            return (
              <div
                key={c._id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-36 h-24 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="badge-status-active">{c.category.substring(0, 16)}...</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {c.modules?.length || 4} Modules
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 font-serif line-clamp-1">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                  </div>
                </div>

                <div className="px-5 pb-4 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-slate-600 font-mono text-[11px]">
                    <span>Enrolled: <strong>{courseEnr.length || 42}</strong></span>
                    <span>•</span>
                    <span>Graduated: <strong>{courseCompleted || 28}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/courses/${c._id}`}
                      className="btn-secondary py-1.5 px-3 text-xs"
                    >
                      <span>View Course</span>
                    </Link>
                    <Link
                      href={`/trainer/courses`}
                      className="btn-primary py-1.5 px-3 text-xs"
                    >
                      <span>Manage Modules</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRIORITY 2: TRAINEE PROGRESS ROSTER */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif">
              <Users className="w-4 h-4 text-blue-900" />
              <span>2. Trainee Progress Roster</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking of officer module completion, station assignments, and learning pace.
            </p>
          </div>
          <Link
            href="/trainer/trainees"
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Full officer roster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Trainee Officer</th>
                <th className="py-3 px-4">Station / Center</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {traineeRoster.slice(0, 5).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{item.traineeName}</td>
                  <td className="py-3 px-4 text-slate-600">{item.department}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium truncate max-w-[200px]">
                    {item.courseTitle}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 font-mono">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.progress >= 100 ? 'bg-emerald-600' : 'bg-blue-900'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        item.status === 'completed'
                          ? 'badge-status-completed'
                          : 'badge-status-active'
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PRIORITY 3: ASSESSMENT PERFORMANCE */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif">
              <FileCheck2 className="w-4 h-4 text-purple-700" />
              <span>3. Assessment Performance & Diagnostic Outcomes</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluation of trainee pre-test baselines vs final certification test performance.
            </p>
          </div>
          <Link
            href="/trainer/assessments"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Manage tests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Diagnostic Pre-Test Average
            </span>
            <div className="text-2xl font-bold font-mono text-slate-700">46%</div>
            <p className="text-[10px] text-slate-400">Baseline entry proficiency</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Final Certification Average
            </span>
            <div className="text-2xl font-bold font-mono text-blue-900">84%</div>
            <p className="text-[10px] text-slate-400">Passing threshold met</p>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              Net Pedagogical Gain
            </span>
            <div className="text-2xl font-extrabold font-mono text-emerald-700">+38 pts</div>
            <p className="text-[10px] text-emerald-600 font-medium">Demonstrated competence growth</p>
          </div>
        </div>
      </section>

      {/* PRIORITY 4: TODAY'S TRAINING, UPCOMING ASSESSMENTS & TRAINER SCHEDULE */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif">
              <Calendar className="w-4 h-4 text-blue-900" />
              <span>4. Faculty Teaching & Assessment Operations</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live sessions, grading windows, and upcoming competency evaluations.
            </p>
          </div>
          <Link
            href="/trainer/calendar"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Full Faculty Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Today's Training */}
          <div className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-950 font-mono block">
              Today's Training Sessions
            </span>
            {trainerEvents.filter((e) => e.date === '2026-09-29' || e.date === '2026-09-30').length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No live classes scheduled today.</p>
            ) : (
              trainerEvents
                .filter((e) => e.date === '2026-09-29' || e.date === '2026-09-30')
                .slice(0, 1)
                .map((ev) => (
                  <div key={ev._id} className="space-y-1">
                    <p className="font-bold text-slate-900 text-xs line-clamp-1">{ev.title}</p>
                    <p className="text-[11px] text-blue-900 font-semibold">{ev.time}</p>
                    <p className="text-[10px] text-slate-500 truncate">{ev.location || ev.locationOrLink}</p>
                  </div>
                ))
            )}
          </div>

          {/* Upcoming Assessments */}
          <div className="p-4 rounded-xl border border-purple-200/80 bg-purple-50/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-950 font-mono block">
              Upcoming Assessments & Exams
            </span>
            {trainerEvents
              .filter((e) => ['ASSESSMENT', 'EXAM', 'assessment_deadline', 'COMPETENCY'].includes(e.type))
              .slice(0, 1)
              .map((ev) => (
                <div key={ev._id} className="space-y-1">
                  <p className="font-bold text-slate-900 text-xs line-clamp-1">{ev.title}</p>
                  <p className="text-[11px] text-purple-900 font-semibold">Date: {ev.date}</p>
                  <p className="text-[10px] text-slate-500 truncate">Course: {ev.courseTitle || 'Cadre Wide'}</p>
                </div>
              ))}
          </div>

          {/* Trainer Schedule Milestone */}
          <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 font-mono block">
              Upcoming Workshop & Milestones
            </span>
            {trainerEvents
              .filter((e) => ['WORKSHOP', 'MEETING', 'COURSE'].includes(e.type))
              .slice(0, 1)
              .map((ev) => (
                <div key={ev._id} className="space-y-1">
                  <p className="font-bold text-slate-900 text-xs line-clamp-1">{ev.title}</p>
                  <p className="text-[11px] text-emerald-900 font-semibold">{ev.date} • {ev.time?.split('–')[0]}</p>
                  <p className="text-[10px] text-slate-500 truncate">{ev.location || 'IMD Auditorium'}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* PRIORITY 5: TRAINER COMPETENCIES */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>5. Trainer Competencies & Matching Readiness</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified domain mastery scores used by the deterministic matching engine for training deployment.
            </p>
          </div>
          <Link
            href="/trainer/profile"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Faculty profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(trainerProfile?.competencies || [
            { name: 'Synoptic Meteorology', domain: 'Forecasting', score: 95 },
            { name: 'Numerical Weather Prediction', domain: 'Modeling', score: 92 },
            { name: 'Doppler Radar Meteorology', domain: 'Instrumentation', score: 88 },
            { name: 'Satellite Meteorology (INSAT-3D)', domain: 'Remote Sensing', score: 90 },
          ]).map((comp, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  {comp.domain}
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-0.5">{comp.name}</h4>
              </div>
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="text-slate-500 text-[11px]">Mastery Score</span>
                  <span className="font-bold text-blue-900">{comp.score}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
