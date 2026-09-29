import Link from 'next/link';
import {
  ArrowRight,
  GraduationCap,
  Users,
  ShieldCheck,
  BookOpen,
  Award,
  BarChart3,
  Bell,
  Library,
  CheckCircle2,
  Brain,
  Megaphone,
  FileCheck2,
  Sparkles,
  Layers,
  ChevronRight,
  MessageSquare,
  Clock,
  ShieldAlert,
  Search,
} from 'lucide-react';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';
import RealtimeIndiaWeatherMap from '@/components/RealtimeIndiaWeatherMap';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';
import GifIcon from '@/components/GifIcon';
import { FontAwesomeIcon, byPrefixAndName } from '@/lib/fontawesome';
import { getCourses, getAnnouncements } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getSessionUser();
  const [featuredCourses, allAnnouncements] = await Promise.all([
    getCourses(),
    getAnnouncements(),
  ]);

  // Priority announcements for homepage display (Problem Statement 26075 requirement)
  const announcements = allAnnouncements.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header user={user} revealOnScroll={true} />

      {/* Hero Section: Atmospheric Parallax Scroll Visuals */}
      <ParallaxComponent title="MeghSetu" />



      {/* Three Pillars: Trainee, Trainer, Admin Architecture (from 26075.txt) */}
      <section className="py-16 border-b border-slate-200 bg-white">
        <div className="portal-container">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Three-Tier Role Architecture
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Fulfilling the core functional specifications of Problem Statement 26075 with purpose-built environments for every meteorological stakeholder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trainee Card */}
            <div className="p-6 rounded-[1.3rem] bg-white border border-slate-200 hover:border-[#1e9df1] hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform text-[#1e9df1]">
                  <FontAwesomeIcon icon={byPrefixAndName.fas['user']} className="w-5 h-5 text-xl" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">Trainee Module</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#1e9df1] border border-blue-200">
                    Cadre Learning
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Empowering meteorological officers and scientists with continuous skill progression and verifiable credentials.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1e9df1] shrink-0 mt-0.5" />
                    <span><strong>Professional Profile:</strong> Qualifications, experience, skills &amp; passport.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1e9df1] shrink-0 mt-0.5" />
                    <span><strong>Course Enrollment:</strong> Multi-tier syllabus, research PDFs &amp; videos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1e9df1] shrink-0 mt-0.5" />
                    <span><strong>MCQ Assessments:</strong> Timed subject-wise tests with real-time feedback.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1e9df1] shrink-0 mt-0.5" />
                    <span><strong>Feedback Loops:</strong> Rate courses, instructors &amp; training content.</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login?demo=trainee"
                className="btn-primary w-full text-xs font-bold py-2.5"
              >
                <span>Launch Trainee Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trainer Card */}
            <div className="p-6 rounded-[1.3rem] bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform text-emerald-600">
                  <FontAwesomeIcon icon={byPrefixAndName.fas['building-columns']} className="w-5 h-5 text-xl" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">Trainer Workspace</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Faculty Hub
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Dedicated tools for subject instructors to author evaluations, distribute materials, and mentor trainees.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Profile Management:</strong> Specialization domain &amp; faculty credentials.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Questionnaire Creator:</strong> Author custom MCQs with strict deadlines.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Trainer Library:</strong> Upload recorded lectures, presentations &amp; PDFs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Performance Analytics:</strong> Monitor batch completion and pass rates.</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login?demo=trainer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-[1.3rem] bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
              >
                <span>Launch Trainer Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Admin Card */}
            <div className="p-6 rounded-[1.3rem] bg-white border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform text-amber-600">
                  <FontAwesomeIcon icon={byPrefixAndName.fas['shield']} className="w-5 h-5 text-xl" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">Admin Governance</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    IMD HQ Oversight
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Executive oversight for regional capacity benchmarks, user role verification, and system broadcasts.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>User Approvals:</strong> Secure signup verification &amp; role assignment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Executive Dashboards:</strong> Monitor enrollments, certs &amp; participation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Homepage Dispatcher:</strong> Publish announcements &amp; achievements.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Trainer Matching Engine:</strong> Competency-based deployment matching.</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login?demo=admin"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-[1.3rem] bg-amber-600 text-white hover:bg-amber-700 transition shadow-xs"
              >
                <span>Launch Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technical Frameworks from 26075.txt */}
      <section className="py-16 border-b border-slate-200 bg-slate-50/50">
        <div className="portal-container">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Core Technical Capabilities
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Advanced modules engineered to solve IMD's specialized operational needs under MoES.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Competency Mapping Engine */}
            <div className="group p-6 rounded-[1.3rem] bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shrink-0">
                  <GifIcon
                    name="doodle-black-955-avatars-message-plus-in-reveal"
                    alt="Competency Mapping"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1e9df1] transition-colors">
                    Automated Competency Mapping Engine
                  </h3>
                  <span className="text-xs text-[#1e9df1] font-semibold">PS 26075 Requirement</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identifies suitable trainers for specialized meteorological subjects—including Radar Meteorology, Numerical Weather Prediction (NWP), Cyclone Warning, and Satellite Interpretations—evaluating instructor qualifications, availability, and past performance benchmarks.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Radar Systems</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Satellite Synoptics</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">NWP Modeling</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Agro-meteorology</span>
              </div>
            </div>

            {/* Centralized Trainer Library */}
            <div className="group p-6 rounded-[1.3rem] bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shrink-0">
                  <GifIcon
                    name="system-solid-4092-book-morph-open"
                    alt="Trainer Library"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Centralized Trainer Knowledge Library
                  </h3>
                  <span className="text-xs text-emerald-600 font-semibold">PS 26075 Requirement</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct repository for verified instructors to upload and share recorded lectures, synoptic presentations, research documents, and standard operating procedures (SOPs), accessible 24/7 across all Regional Meteorological Centres.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Video Lectures</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Synoptic PPTs</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Standard Operating Procedures</span>
              </div>
            </div>

            {/* Subject-wise MCQ Assessments */}
            <div className="group p-6 rounded-[1.3rem] bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shrink-0">
                  <GifIcon
                    name="system-solid-153-bar-chart-vertical-grow-hover-pinch"
                    alt="Assessments & Analytics"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    Subject-Wise MCQ Assessment Engine
                  </h3>
                  <span className="text-xs text-purple-600 font-semibold">PS 26075 Requirement</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trainers configure questionnaires with fixed deadlines and automated evaluation. Trainees receive real-time score breakdowns, performance analysis, and customized remedial course mappings.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Timed MCQs</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Submission Deadlines</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Auto Evaluation</span>
              </div>
            </div>

            {/* Verifiable Credentials & Feedback */}
            <div className="group p-6 rounded-[1.3rem] bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shrink-0">
                  <GifIcon
                    name="system-solid-3235-badge-ribbon-hover-pinch"
                    alt="Certificates"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Verifiable Certifications &amp; Feedback Loop
                  </h3>
                  <span className="text-xs text-amber-600 font-semibold">PS 26075 Requirement</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates official IMD digital certificates upon achieving 100% course completion and meeting minimum passing scores, secured with instant QR code validation alongside course feedback metrics.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">QR Code Verification</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Competency Passports</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Quality Feedback</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Broadcast: Homepage Announcements & Achievements (from 26075.txt) */}
      <section className="py-16 border-b border-slate-200 bg-white">
        <div className="portal-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1e9df1] uppercase tracking-wider mb-2">
                <GifIcon name="system-solid-3235-badge-ribbon-hover-pinch" alt="Broadcast" className="w-4 h-4 object-contain inline-block" />
                <span>Admin Homepage Broadcasts</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Announcements &amp; Achievements
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Official circulars, organizational milestones, and newly published learning content.
              </p>
            </div>
            <Link
              href="/login?demo=trainee"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e9df1] hover:underline group"
            >
              <span>View all notifications</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((ann) => (
              <div
                key={ann._id}
                className="group p-5 rounded-[1.3rem] bg-slate-50 border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        ann.type === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : ann.type === 'achievement'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : ann.type === 'course'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {ann.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(ann.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#1e9df1] transition-colors">
                    {ann.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {ann.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/70 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700 truncate max-w-[160px]">
                    {ann.author}
                  </span>
                  <span className="capitalize">{ann.targetRole} Cadre</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses / Curriculum Section */}
      <section className="py-16 border-b border-slate-200 bg-slate-50/40">
        <div className="portal-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Curriculum &amp; Course Catalog
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Newly added learning content structured by operational division requirements.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#1e9df1] transition group"
            >
              <GifIcon name="wired-lineal-11-link-hover-bounce" alt="Courses link" className="w-4 h-4 object-contain inline-block" />
              <span>Explore all courses</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 3).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Weather Observations & Regional Network (KEPT ALWAYS AT BOTTOM) */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="portal-container">
          <RealtimeIndiaWeatherMap />
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-white mt-auto">
        <div className="portal-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-white">MeghSetu</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1e9df1] text-white">PS 26075</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                <strong>CAPACITY CONNECT</strong> — Digital Capacity Building and Learning Management Portal for the India Meteorological Department, Ministry of Earth Sciences, Government of India.
              </p>
              <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                <p>Problem Statement ID: 26075 &bull; Theme: Smart Education</p>
                <p>Scalable, secure, and accessible across all devices.</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">
                Role Portals
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link href="/login?demo=trainee" className="hover:text-white transition">
                    Trainee Portal (Passport &amp; MCQs)
                  </Link>
                </li>
                <li>
                  <Link href="/login?demo=trainer" className="hover:text-white transition">
                    Trainer Workspace (Library &amp; Analytics)
                  </Link>
                </li>
                <li>
                  <Link href="/login?demo=admin" className="hover:text-white transition">
                    Admin Governance (Approvals &amp; Heatmaps)
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-white transition">
                    Course Catalog &amp; Modules
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">
                Institutional Contact
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Mausam Bhawan, Lodhi Road,
                <br />
                New Delhi &ndash; 110003, India.
                <br />
                Ministry of Earth Sciences (MoES).
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <p>&copy; 2026 India Meteorological Department (IMD). All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Ministry of Earth Sciences, Government of India &bull; Smart Education</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
