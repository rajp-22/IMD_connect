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
import RealtimeIndiaWeatherMap from '@/components/RealtimeIndiaWeatherMap';
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
      <section className="bg-gradient-to-b from-[#061426] via-[#091b36] to-[#0a2347] text-white py-14 sm:py-20 lg:py-24 border-b border-slate-800/80 relative overflow-hidden">
        {/* Layer 1: High-Tech Meteorological Coordinate Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c718_1px,transparent_1px),linear-gradient(to_bottom,#0284c718_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_70%,transparent_100%)] opacity-55 pointer-events-none"></div>

        {/* Layer 2: Visible Atmospheric Clouds & Earth Observation Imagery */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* Earth Atmosphere Orbit Imagery (Visible 35% opacity with bright cyan glow highlights) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80"
            alt="Earth Atmosphere and Meteorological Satellite Observation View"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-screen scale-105 animate-atmospheric-drift"
            loading="eager"
          />

          {/* Dynamic Cloud Formations Overlay */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1400&auto=format&fit=crop&q=70"
            alt="Atmospheric Cloud Formation"
            className="absolute -top-10 -right-10 w-2/3 h-full object-cover opacity-22 mix-blend-lighten hidden md:block"
          />

          {/* Gradient Masks configured for optimal text legibility and rich visual depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061426] via-[#061426]/90 via-55% to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a2347] via-transparent via-60% to-[#061426]/75"></div>
        </div>

        {/* Layer 3: Moving Synoptic Isobars & Atmospheric Flow Vectors across the entire Hero */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-65 z-0" aria-hidden="true">
          <svg className="w-full h-full min-w-[1000px]" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Primary Jet Stream / Monsoon Flow Vector (Cyan) */}
            <path
              d="M-80 260 C 260 380, 580 120, 960 320 C 1180 430, 1360 220, 1520 250"
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeDasharray="14 10"
              className="animate-wind-flow filter drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
            />
            {/* Secondary Upper-Air Tropospheric Trough Line (Sky Blue) */}
            <path
              d="M-80 340 C 220 480, 620 180, 1020 390 C 1220 490, 1400 310, 1520 330"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeDasharray="8 6"
              className="animate-wind-flow-slow filter drop-shadow-[0_0_4px_rgba(96,165,250,0.5)]"
            />
            {/* Surface Geostrophic Wind Contours (Blue/Emerald) */}
            <path
              d="M-80 180 C 320 290, 720 70, 1120 240 C 1280 320, 1400 190, 1520 210"
              stroke="#34d399"
              strokeWidth="1.2"
              strokeDasharray="6 8"
              strokeOpacity="0.75"
              className="animate-wind-flow"
            />
            {/* Low Latitude Intertropical Convergence Zone (ITCZ) Wave */}
            <path
              d="M-80 440 C 300 520, 700 340, 1100 480 C 1260 540, 1420 420, 1520 450"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.5"
            />
          </svg>
        </div>

        {/* Hero Content Container */}
        <div className="portal-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: HERO CONTENT (48-50% width on desktop) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Official Directorate Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/90 border border-blue-600/70 text-amber-300 text-xs font-semibold animate-hero-fade backdrop-blur-md shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                <span className="tracking-wide">
                  Ministry of Earth Sciences • India Meteorological Department
                </span>
              </div>

              {/* Title & Subtitles */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif text-white leading-[1.1] animate-hero-fade-delay-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                  MeghSetu
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-cyan-300 font-semibold mt-2.5 tracking-tight animate-hero-fade-delay-2 drop-shadow-xs">
                  Digital Learning Management & Organizational Capacity Building Portal
                </p>
                <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed animate-hero-fade-delay-3 max-w-xl font-normal">
                  A specialized national digital learning and competency governance portal engineered for the{' '}
                  <strong className="text-white font-semibold">
                    India Meteorological Department (IMD)
                  </strong>
                  . Empowering operational meteorologists, observers, and researchers across all Regional Meteorological Centres with structured curriculum, real-time competency evaluations, and automated capacity mapping.
                </p>
              </div>

              {/* Evaluator Single-Click Demo Access Bar */}
              <div className="p-4 sm:p-5 bg-slate-900/85 backdrop-blur-xl border border-sky-500/30 rounded-2xl shadow-2xl transition duration-300 hover:border-sky-400/50 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                    <span>Instant Evaluator Demo Access (Single-Click Sign In):</span>
                  </p>
                  <span className="text-[10px] font-mono text-cyan-300/80 hidden sm:inline-block">
                    Live Role Presets
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Trainee Demo Button (Blue) */}
                  <Link
                    href="/login?demo=trainee"
                    className="btn-demo-hover px-3.5 py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-between transition shadow-md border border-blue-400/30 group"
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <span>Trainee Demo</span>
                      </div>
                      <div className="text-[10px] text-blue-200 font-mono">Pooja Iyer (RMC Mumbai)</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  {/* Trainer Demo Button (Green/Emerald) */}
                  <Link
                    href="/login?demo=trainer"
                    className="btn-demo-hover px-3.5 py-3 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-between transition shadow-md border border-emerald-400/30 group"
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <span>Trainer Demo</span>
                      </div>
                      <div className="text-[10px] text-emerald-200 font-mono">Dr. Rajesh Sharma (NWP)</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  {/* Admin Demo Button (Saffron / Amber) */}
                  <Link
                    href="/login?demo=admin"
                    className="btn-demo-hover px-3.5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-semibold flex items-center justify-between transition shadow-md border border-amber-400/30 group"
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <span>Admin Demo</span>
                      </div>
                      <div className="text-[10px] text-amber-100 font-mono">Dr. M. Mohapatra (DG)</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DYNAMIC REAL-TIME INDIA WEATHER MAP (50-52% width) */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <RealtimeIndiaWeatherMap />
            </div>
          </div>
        </div>

        {/* Subtle Atmospheric Transition Border into Core Capabilities below */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white via-white/20 to-transparent pointer-events-none"></div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-14 bg-white border-b border-slate-200 relative">
        <div className="portal-container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
              Government-Grade Learning Infrastructure
            </h2>
            <p className="text-2xl font-bold font-serif text-slate-900">
              Core Capabilities for IMD Capacity Building
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-meteorology p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition group relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center mb-3 transition-transform group-hover:scale-105 duration-200">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-900 transition-colors">Modular Curriculum</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-tier modules with lessons, research PDFs, recorded video lectures, and
                operational guides.
              </p>
            </div>

            <div className="card-meteorology p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition group relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3 transition-transform group-hover:scale-105 duration-200">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-emerald-900 transition-colors">Skill Gap Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compares individual proficiency against operational benchmarks, mapping remedial
                courses dynamically.
              </p>
            </div>

            <div className="card-meteorology p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition group relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-3 transition-transform group-hover:scale-105 duration-200">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-900 transition-colors">Trainer Competency Match</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic matching engine ranking verified instructors for specialized subject
                deployments.
              </p>
            </div>

            <div className="card-meteorology p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition group relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center mb-3 transition-transform group-hover:scale-105 duration-200">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-purple-900 transition-colors">Digital Certificates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official certificates generated upon 100% completion and passing the evaluation
                assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-14 bg-slate-50 flex-1 relative">
        <div className="portal-container relative z-10">
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 transition group"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 mt-auto">
        <div className="portal-container py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-blue-800 text-white flex items-center justify-center">
                  <CloudSun className="w-5 h-5 text-amber-400" />
                </div>
                <span className="font-bold text-white text-base font-serif">
                  IMD MEGHSETU
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
