import Link from 'next/link';
import { BookOpen, GraduationCap, Clock, Award, ArrowRight } from 'lucide-react';
import { getSessionUser } from '@/lib/auth';
import { getEnrollments, getCourses } from '@/lib/data-service';
import CourseCard from '@/components/CourseCard';

export const dynamic = 'force-dynamic';

export default async function TraineeCoursesPage() {
  const session = await getSessionUser();
  const userId = session?.id || 'usr_trainee_001';

  const [enrollments, allCourses] = await Promise.all([
    getEnrollments(userId),
    getCourses(),
  ]);

  const enrolledCourseIds = enrollments.map((e) => e.courseId);
  const enrolledCourses = allCourses.filter((c) => enrolledCourseIds.includes(c._id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900">
            My Learning & Enrolled Courses
          </h1>
          <p className="text-xs text-slate-500">
            Track your course progress, study lesson materials, and prepare for evaluation exams.
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition shadow-xs self-start"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Browse Course Catalog</span>
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
        <div className="p-12 bg-white rounded-xl border border-slate-200 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Active Courses Enrolled</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Enroll in standard IMD courses to start upskilling and improving your competency profile.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-950 text-white rounded-lg text-xs font-bold hover:bg-blue-900 transition"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
