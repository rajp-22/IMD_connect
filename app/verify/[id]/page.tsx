import React from 'react';
import Link from 'next/link';
import { getCertificateByVerificationCode } from '@/lib/data-service';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  User,
  BookOpen,
  Building2,
  CloudSun,
  ExternalLink,
} from 'lucide-react';

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await getCertificateByVerificationCode(id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Gov Header Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 text-center border-b border-slate-800">
        <span className="font-semibold text-white">भारत सरकार | Government of India</span> •{' '}
        <span>पृथ्वी विज्ञान मंत्रालय | Ministry of Earth Sciences (MoES)</span> •{' '}
        <span>India Meteorological Department</span>
      </div>

      <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-12 w-full">
        {cert ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in">
            {/* Verified Header Banner */}
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest bg-emerald-700/60 px-2 py-0.5 rounded border border-emerald-500/40">
                    Official Verification Result
                  </span>
                  <h1 className="text-xl font-bold tracking-tight mt-0.5">
                    Certificate Verified Authentic ✓
                  </h1>
                </div>
              </div>
              <ShieldCheck className="w-8 h-8 text-emerald-300 shrink-0 hidden sm:block" />
            </div>

            {/* Certificate Details Body */}
            <div className="p-6 space-y-6 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[11px] text-slate-500 font-mono">Unique Credential Identifier:</div>
                <div className="text-lg font-bold text-blue-950 font-mono tracking-wider">
                  {cert.certificateId}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Recorded on IMD Central Capacity Verification Ledger</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 space-y-3">
                <div className="pt-3 flex items-start justify-between">
                  <div className="text-slate-500 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Certified Trainee</span>
                  </div>
                  <div className="text-right font-bold text-slate-900 text-sm">
                    {cert.traineeName}
                  </div>
                </div>

                <div className="pt-3 flex items-start justify-between">
                  <div className="text-slate-500 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>Certified Course</span>
                  </div>
                  <div className="text-right font-bold text-blue-900 text-sm max-w-xs">
                    {cert.courseName}
                  </div>
                </div>

                <div className="pt-3 flex items-start justify-between">
                  <div className="text-slate-500 flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>Lead Trainer / Certifier</span>
                  </div>
                  <div className="text-right font-semibold text-slate-800">
                    {cert.trainerName}
                  </div>
                </div>

                <div className="pt-3 flex items-start justify-between">
                  <div className="text-slate-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Completion & Issue Date</span>
                  </div>
                  <div className="text-right font-mono text-slate-800">
                    {new Date(cert.issueDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div className="pt-3 flex items-start justify-between">
                  <div className="text-slate-500 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>Issuing Authority</span>
                  </div>
                  <div className="text-right text-slate-700">
                    Central Training Division, India Meteorological Department
                  </div>
                </div>
              </div>

              {/* Privacy protection notice */}
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-[11px] text-blue-900">
                Notice: In accordance with privacy and security directives, personal contact details, scores, and disciplinary records are not published on this public verification registry.
              </div>
            </div>

            {/* Verification Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Link
                href="/"
                className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1.5"
              >
                <CloudSun className="w-4 h-4" />
                <span>Return to Capacity Connect Portal</span>
              </Link>
              <span className="text-[10px] text-slate-400 font-mono">CC-VER-V2.6</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Certificate Verification Failed</h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No authentic credential found corresponding to code &ldquo;{id}&rdquo;. Please verify the QR code URL or contact the IMD Capacity Connect examination board.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Gov Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        © 2026 India Meteorological Department, Ministry of Earth Sciences. Prototype Demo Platform.
      </footer>
    </div>
  );
}
