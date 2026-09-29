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
  QrCode,
  ExternalLink,
  Calendar,
  Building2,
  FileCheck,
  Medal,
} from 'lucide-react';
import { ICompetencyPassport } from '@/lib/types';

interface CompetencyPassportProps {
  passport: ICompetencyPassport;
}

export default function CompetencyPassportView({ passport }: CompetencyPassportProps) {
  return (
    <div className="space-y-6">
      {/* Official Government Passport Card Container */}
      <div className="relative rounded-xl bg-white text-slate-900 shadow-sm border border-slate-300 overflow-hidden">
        {/* Institutional Top Strip */}
        <div className="bg-[#0b2545] text-white p-6 sm:p-8 border-b-4 border-amber-600">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-blue-900 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-inner">
                <Shield className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-semibold">
                    Official Credential
                  </span>
                  <span className="text-xs text-blue-200 font-mono">
                    REG: IMD-PASS-{passport.traineeId.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif mt-1">
                  METEOROLOGICAL COMPETENCY PASSPORT
                </h1>
                <p className="text-xs text-blue-200">
                  India Meteorological Department • Ministry of Earth Sciences, Govt. of India
                </p>
              </div>
            </div>

            {/* Verification Status */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 bg-blue-900/60 rounded-lg border border-blue-700/50 text-center">
                <div className="flex items-center justify-center gap-1.5 text-amber-300 font-bold text-xs font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{passport.learningStreakDays} Days Active</span>
                </div>
                <span className="text-[10px] text-blue-200">Continuous Learning Record</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Trainee Identity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="w-20 h-20 rounded-lg bg-blue-900 border border-slate-300 overflow-hidden shrink-0 shadow-xs">
                {passport.avatar ? (
                  <img
                    src={passport.avatar}
                    alt={passport.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-amber-300 font-serif">
                    {passport.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">
                  Cadre Officer Holder
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  {passport.name}
                </h2>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{passport.designation} • {passport.department}</span>
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Official Competency Verified by IMD Central Examination Authority</span>
                </div>
              </div>
            </div>

            {/* Quick Learning Stats */}
            <div className="grid grid-cols-3 gap-2 p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="p-2 bg-white rounded border border-slate-200 flex flex-col justify-center">
                <div className="text-lg font-bold text-slate-900 font-mono">{passport.totalLearningHours}</div>
                <div className="text-[10px] text-slate-500 leading-tight">Training Hours</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200 flex flex-col justify-center">
                <div className="text-lg font-bold text-blue-900 font-mono">{passport.completedCoursesCount}</div>
                <div className="text-[10px] text-slate-500 leading-tight">Courses Completed</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200 flex flex-col justify-center">
                <div className="text-lg font-bold text-emerald-700 font-mono">{passport.assessmentAverage}%</div>
                <div className="text-[10px] text-slate-500 leading-tight">Exam Average</div>
              </div>
            </div>
          </div>

          {/* Verified Competencies Section */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-900" />
                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-800">
                  Verified Meteorological Competencies
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Assessed via Practical Evaluations & Exams
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {passport.verifiedCompetencies.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{comp.name}</div>
                      <div className="text-[10px] text-slate-500">Proficiency: {comp.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-blue-950 font-mono">{comp.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issued Certificates Section with QR links */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-900" />
                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-800">
                  Registered Professional Certificates
                </h3>
              </div>
              <Link
                href="/trainee/certificates"
                className="text-[11px] text-blue-900 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>View all in registry</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {passport.certificates.map((cert) => (
                <div
                  key={cert.certificateId}
                  className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{cert.courseName}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Credential ID: {cert.certificateId}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium mt-1">
                      Score: {cert.scorePercentage}% • Issued {new Date(cert.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <Link
                    href={`/verify/${cert.verificationCode}`}
                    className="px-2.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-[10px] font-semibold flex items-center gap-1 shadow-2xs transition shrink-0"
                  >
                    <QrCode className="w-3 h-3" />
                    <span>Verify QR</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Professional Milestones */}
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
              <Medal className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold tracking-wider uppercase text-slate-800">
                Institutional Qualification Milestones
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {passport.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-lg border border-slate-200 text-left hover:border-blue-400 transition shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center mb-2">
                    <Award className="w-4 h-4 text-blue-900" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">{m.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {m.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
