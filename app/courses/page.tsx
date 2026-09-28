import Link from 'next/link';
import { Search, Filter, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import PrototypeDisclaimer from '@/components/PrototypeDisclaimer';
import CourseCard from '@/components/CourseCard';
import { getCourses, getEnrollments } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function CoursesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; difficulty?: string; search?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();

  const [courses, enrollments] = await Promise.all([
    getCourses({
      category: params.category,
      difficulty: params.difficulty,
      search: params.search,
    }),
    user ? getEnrollments(user.id) : Promise.resolve([]),
  ]);

  const categories = [
    'All',
    'Synoptic Meteorology & Forecasting',
    'Remote Sensing & Earth Observation',
    'Computational Meteorology & GIS',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} />
      <PrototypeDisclaimer />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
            IMD National Training Roster
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
            Course Catalog & Capacity Building Curricula
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified technical and operational courses aligned with IMD division competency
            frameworks.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isSelected = (!params.category && cat === 'All') || params.category === cat;
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/courses' : `/courses?category=${encodeURIComponent(cat)}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => {
            const enr = enrollments.find((e) => e.courseId === c._id);
            return <CourseCard key={c._id} course={c} enrollment={enr} />;
          })}
        </div>
      </main>
    </div>
  );
}
