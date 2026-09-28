import Link from 'next/link';
import {
  CloudSun,
  ShieldCheck,
  Award,
  BookOpen,
  Compass,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import Header from '@/components/Header';
import PrototypeDisclaimer from '@/components/PrototypeDisclaimer';
import CourseCard from '@/components/CourseCard';
import { getCourses } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getSessionUser();
  const featuredCourses = await getCourses();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} />
      <PrototypeDisclaimer />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-950 via-slate-900 to-blue-950 text-white py-14 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-700/60 text-amber-300 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Ministry of Earth Sciences • Official Capacity Building Initiative</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif text-white leading-tight">
              IMD Capacity Connect
            </h1>
            <p className="text-xl text-blue-200 mt-2 font-medium">
              Digital Learning Management & Organizational Capacity Building Portal
            </p>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              A specialized national digital portal engineered for the{' '}
              <strong className="text-white font-semibold">
                India Meteorological Department (IMD)
              </strong>
              , Ministry of Earth Sciences. Empowering operational meteorologists, observers, and
              researchers with structured competencies, skill gap analysis, and certified learning paths.
            </p>

            {/* Quick Demo Access Bar */}
            <div className="mt-8 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Evaluator Demo Access (Single-Click Sign In):</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <Link
                  href="/login?demo=trainee"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-between transition shadow-xs"
                >
                  <div>
                    <div className="font-bold">Trainee Demo</div>
                    <div className="text-[10px] text-blue-200">Pooja Iyer (RMC Mumbai)</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/login?demo=trainer"
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-between transition shadow-xs"
                >
                  <div>
                    <div className="font-bold">Trainer Demo</div>
                    <div className="text-[10px] text-emerald-200">Dr. Rajesh Sharma (NWP)</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/login?demo=admin"
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-between transition shadow-xs"
                >
                  <div>
                    <div className="font-bold">Admin Demo</div>
                    <div className="text-[10px] text-amber-100">Dr. M. Mohapatra (DG)</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
              Government-Grade Learning Infrastructure
            </h2>
            <p className="text-2xl font-bold font-serif text-slate-900">
              Core Capabilities for IMD Capacity Building
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Modular Curriculum</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-tier modules with lessons, research PDFs, recorded video lectures, and
                operational guides.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Skill Gap Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compares individual proficiency against operational benchmarks, mapping remedial
                courses dynamically.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Trainer Competency Match</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic matching engine ranking verified instructors for specialized subject
                deployments.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Digital Certificates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official certificates generated upon 100% completion and passing the evaluation
                assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 bg-slate-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Course Catalog
              </span>
              <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
                Featured Capacity Building Courses
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Prototype demonstration curricula structured for IMD training divisions.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 transition"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-blue-800 text-white flex items-center justify-center">
                  <CloudSun className="w-5 h-5 text-amber-400" />
                </div>
                <span className="font-bold text-white text-base font-serif">
                  IMD CAPACITY CONNECT
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                An integrated capacity management and competency evaluation platform developed for
                the India Meteorological Department (IMD), Ministry of Earth Sciences, Government of
                India.
              </p>
              <p className="text-[11px] text-amber-400 mt-3 font-medium">
                Prototype Demo Content — Not Official IMD Material.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Portal Portals
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/trainee/dashboard" className="hover:text-white transition">
                    Trainee Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/trainer/dashboard" className="hover:text-white transition">
                    Trainer Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/dashboard" className="hover:text-white transition">
                    Admin Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-white transition">
                    Course Catalog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Governance & Verification
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Mausam Bhawan, Lodhi Road,
                <br />
                New Delhi - 110003, India.
                <br />
                Ministry of Earth Sciences.
              </p>
              <div className="mt-3 text-[11px] text-slate-500">
                <span>Portal Build: 2026.1-PROD</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <p>© 2026 India Meteorological Department. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Ministry of Earth Sciences, Government of India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
