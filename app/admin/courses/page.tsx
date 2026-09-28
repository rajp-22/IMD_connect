import Link from 'next/link';
import { BookOpen, Star, PlusCircle, ArrowRight } from 'lucide-react';
import { getCourses } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900">
            Institutional Course Catalog Management
          </h1>
          <p className="text-xs text-slate-500">
            Publish, curate, and review syllabus modules across all meteorological domains.
          </p>
        </div>
        <Link
          href="/trainer/courses/create"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Author New Course</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.thumbnail}
                alt={c.title}
                className="w-full h-36 object-cover bg-slate-900"
              />
              <div className="p-4">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>{c.category}</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1 font-mono">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {c.rating}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm font-serif line-clamp-1 mb-1">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {c.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 py-2 border-t border-slate-100 font-mono">
                  <span>Instructor: {c.trainerName}</span>
                  <span className="text-blue-900 font-bold">{c.enrolledCount} Enrolled</span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <Link
                href={`/courses/${c._id}`}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 rounded-md text-xs font-semibold border border-slate-200 transition"
              >
                <span>Inspect Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
