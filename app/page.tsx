import Link from 'next/link';
import {
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';
import RealtimeIndiaWeatherMap from '@/components/RealtimeIndiaWeatherMap';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';
import GifIcon from '@/components/GifIcon';
import { getCourses } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getSessionUser();
  const featuredCourses = await getCourses();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7f6f3' }}>
      <Header user={user} revealOnScroll={true} />

      {/* Hero Section: Atmospheric Parallax Scroll Visuals */}
      <ParallaxComponent title="MeghSetu" />

      {/* What the portal does */}
      <section className="py-16 border-b border-stone-200" style={{ backgroundColor: '#ffffff' }}>
        <div className="portal-container">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              What this portal provides
            </h2>
            <p className="text-sm text-stone-500 mt-2 leading-relaxed max-w-lg">
              Built for IMD's training divisions to manage curriculum delivery,
              track competency, and match trainers to operational needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {/* Modular curriculum */}
            <div className="flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200/80 p-2 group-hover:bg-blue-50/60 group-hover:border-blue-200 transition-all">
                <GifIcon
                  name="system-solid-4092-book-morph-open"
                  alt="Modular curriculum"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-stone-900 group-hover:text-blue-950 transition-colors">
                  Modular curriculum
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Multi-tier modules with lessons, research PDFs, recorded video
                  lectures, and operational guides structured by department need.
                </p>
              </div>
            </div>

            {/* Skill gap analysis */}
            <div className="flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200/80 p-2 group-hover:bg-blue-50/60 group-hover:border-blue-200 transition-all">
                <GifIcon
                  name="system-solid-153-bar-chart-vertical-grow-hover-pinch"
                  alt="Skill gap analysis"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-stone-900 group-hover:text-blue-950 transition-colors">
                  Skill gap analysis
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Compares individual proficiency against operational benchmarks
                  and maps remedial courses dynamically per trainee.
                </p>
              </div>
            </div>

            {/* Trainer competency matching */}
            <div className="flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200/80 p-2 group-hover:bg-blue-50/60 group-hover:border-blue-200 transition-all">
                <GifIcon
                  name="doodle-black-955-avatars-message-plus-in-reveal"
                  alt="Trainer competency matching"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-stone-900 group-hover:text-blue-950 transition-colors">
                  Trainer competency matching
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Ranks verified instructors for specialized subject deployments
                  based on expertise, availability, and past performance.
                </p>
              </div>
            </div>

            {/* Digital certificates */}
            <div className="flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200/80 p-2 group-hover:bg-blue-50/60 group-hover:border-blue-200 transition-all">
                <GifIcon
                  name="system-solid-3235-badge-ribbon-hover-pinch"
                  alt="Digital certificates"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-stone-900 group-hover:text-blue-950 transition-colors">
                  Digital certificates
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Official certificates generated upon 100% completion and
                  passing the evaluation assessment, verifiable by QR code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 border-b border-stone-200">
        <div className="portal-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                Courses
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Demonstration curricula structured for IMD training divisions.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 hover:text-stone-600 transition group"
            >
              <GifIcon name="wired-lineal-11-link-hover-bounce" alt="Courses link" className="w-4 h-4 object-contain inline-block" />
              <span>All courses</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Weather Observations & Regional Network (Compact Half-Page Layout) */}
      <section className="py-12 sm:py-16 border-t border-stone-200" style={{ backgroundColor: '#ffffff' }}>
        <div className="portal-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Context & Overview */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GifIcon name="wired-lineal-1-cloud-hover-pinch" alt="Cloud" className="w-5 h-5 object-contain" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block">
                    Live Synoptic Feed
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                  National Weather Grid
                </h2>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                  Real-time synoptic telemetry across AWS stations, Doppler Radars, and Regional Meteorological Centres throughout India.
                </p>
              </div>

              {/* Status pills */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Primary RMC Hubs</span>
                  <span className="text-base font-bold text-stone-900 mt-0.5 block">6 Centres</span>
                  <span className="text-[10px] text-emerald-700 font-medium">● Operational</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Surface AWS Network</span>
                  <span className="text-base font-bold text-stone-900 mt-0.5 block">750+ Feeds</span>
                  <span className="text-[10px] text-sky-700 font-medium">Synoptic intervals</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1">
                <p className="text-xs font-semibold text-sky-300">
                  Interactive Observation Layers
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Toggle surface temperatures, rainfall accumulations, wind vector streams, and isobaric pressure directly on the map.
                </p>
              </div>
            </div>

            {/* Right Column: Compact Weather Map (Half Page) */}
            <div className="lg:col-span-7">
              <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-950 p-2 sm:p-3 shadow-xl border border-slate-800">
                <RealtimeIndiaWeatherMap compact={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-auto" style={{ backgroundColor: '#f0efec' }}>
        <div className="portal-container py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-bold text-stone-900 text-sm">
                IMD MeghSetu
              </p>
              <p className="text-stone-500 text-xs leading-relaxed mt-2 max-w-sm">
                An integrated capacity management and competency evaluation
                platform for the India Meteorological Department, Ministry of
                Earth Sciences, Government of India.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-3">
                Portal
              </h4>
              <ul className="space-y-2 text-xs text-stone-500">
                <li>
                  <Link href="/trainee/dashboard" className="hover:text-stone-900 transition">
                    Trainee Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/trainer/dashboard" className="hover:text-stone-900 transition">
                    Trainer Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/dashboard" className="hover:text-stone-900 transition">
                    Admin Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-stone-900 transition">
                    Course Catalog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-3">
                Contact
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed">
                Mausam Bhawan, Lodhi Road,
                <br />
                New Delhi &ndash; 110003, India.
                <br />
                Ministry of Earth Sciences.
              </p>
            </div>
          </div>

          <div className="border-t border-stone-300 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400">
            <p>&copy; 2026 India Meteorological Department. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Ministry of Earth Sciences, Government of India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
