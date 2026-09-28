'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  TrendingUp,
  Flame,
  QrCode,
  ExternalLink,
  Sparkles,
  Calendar,
  Building2,
} from 'lucide-react';
import { ICompetencyPassport } from '@/lib/types';

interface CompetencyPassportProps {
  passport: ICompetencyPassport;
}

export default function CompetencyPassportView({ passport }: CompetencyPassportProps) {
  return (
    <div className="space-y-6">
      {/* Official Government Passport Card Container */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl border-4 border-amber-500/60 overflow-hidden p-6 sm:p-8">
        {/* Subtle Watermark Background */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
          <Shield className="w-96 h-96 text-white" />
        </div>

        {/* Passport Header Strip */}
        <div className="border-b border-amber-500/40 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-blue-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  Official Credential
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ID: IMD-PASS-{passport.traineeId.toUpperCase()}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif mt-0.5">
                COMPETENCY PASSPORT
              </h1>
              <p className="text-xs text-blue-200">
                India Meteorological Department • Ministry of Earth Sciences, Govt. of India
              </p>
            </div>
          </div>

          {/* Gamification Streak & Security Badge */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 bg-white/10 rounded-xl border border-white/15 text-center backdrop-blur-xs">
              <div className="flex items-center justify-center gap-1 text-orange-400 font-bold text-sm">
                <Flame className="w-4 h-4 fill-orange-400" />
                <span>{passport.learningStreakDays} Days</span>
              </div>
              <span className="text-[10px] text-slate-300">Active Learning Streak</span>
            </div>
          </div>
        </div>

        {/* Trainee Identity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="w-20 h-20 rounded-xl bg-blue-900 border-2 border-amber-400/60 overflow-hidden shrink-0 shadow-md">
              {passport.avatar ? (
                <img
                  src={passport.avatar}
                  alt={passport.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-amber-400">
                  {passport.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-xs text-amber-400 font-mono uppercase tracking-wider font-semibold">
                Cadre Holder
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                {passport.name}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-300" />
                <span>{passport.designation} • {passport.department}</span>
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Official Identity Verified by IMD Directorate</span>
              </div>
            </div>
          </div>

          {/* Quick Learning Stats */}
          <div className="grid grid-cols-3 gap-2 bg-white/5 p-4 rounded-xl border border-white/10 text-center">
            <div className="p-2 bg-white/5 rounded-lg flex flex-col justify-center">
              <div className="text-lg font-bold text-amber-400">{passport.totalLearningHours}</div>
              <div className="text-[10px] text-slate-300 leading-tight">Learning Hours</div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg flex flex-col justify-center">
              <div className="text-lg font-bold text-blue-300">{passport.completedCoursesCount}</div>
              <div className="text-[10px] text-slate-300 leading-tight">Courses Completed</div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg flex flex-col justify-center">
              <div className="text-lg font-bold text-emerald-400">{passport.assessmentAverage}%</div>
              <div className="text-[10px] text-slate-300 leading-tight">Assessment Average</div>
            </div>
          </div>
        </div>

        {/* Verified Competencies Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold tracking-wider uppercase text-amber-300">
                Verified Competencies
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Validated by IMD Examination Board
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {passport.verifiedCompetencies.map((comp, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{comp.name}</div>
                    <div className="text-[10px] text-slate-400">Level: {comp.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 font-mono">{comp.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Issued Certificates Section with QR links */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold tracking-wider uppercase text-amber-300">
                Issued Professional Certificates
              </h3>
            </div>
            <Link
              href="/trainee/certificates"
              className="text-[11px] text-blue-300 hover:text-white flex items-center gap-1"
            >
              <span>View full registry</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {passport.certificates.map((cert) => (
              <div
                key={cert.certificateId}
                className="p-3.5 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-xl border border-blue-400/30 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{cert.courseName}</div>
                  <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                    Cert ID: {cert.certificateId}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    Score: {cert.scorePercentage}% • Issued {new Date(cert.issueDate).toLocaleDateString()}
                  </div>
                </div>
                <Link
                  href={`/verify/${cert.verificationCode}`}
                  className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-blue-950 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition shrink-0"
                >
                  <QrCode className="w-3 h-3" />
                  <span>Verify QR</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Gamification Milestone Badges (Feature 22) */}
        <div>
          <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-amber-300">
              Professional Achievement Badges
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {passport.milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/5 rounded-xl border border-white/10 text-center hover:border-amber-400/40 transition"
              >
                <div className="text-2xl mb-1">{m.badge.split(' ')[0]}</div>
                <div className="text-xs font-bold text-white truncate">{m.title}</div>
                <div className="text-[10px] text-slate-300 line-clamp-2 mt-0.5">
                  {m.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
