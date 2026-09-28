'use client';

import React from 'react';
import { Award, Printer, Download, CheckCircle2, ShieldCheck, Calendar, Hash } from 'lucide-react';
import { ICertificate } from '@/lib/types';

interface CertificateViewProps {
  certificate: ICertificate;
  onClose?: () => void;
}

export default function CertificateView({ certificate, onClose }: CertificateViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 p-4 sm:p-8 rounded-xl max-w-4xl mx-auto my-6 shadow-md border border-slate-300">
      {/* Controls Bar (hidden during printing) */}
      <div className="no-print flex items-center justify-between mb-6 pb-4 border-b border-slate-300">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Official Digital Certificate</h3>
            <p className="text-xs text-slate-500 font-mono">ID: {certificate.certificateId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-md text-xs font-semibold shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-xs font-medium transition"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Official Certificate Paper Frame */}
      <div className="certificate-frame bg-white border-8 border-double border-blue-950 p-8 sm:p-12 relative shadow-xl text-center rounded-xs overflow-hidden">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-[120px] font-black uppercase text-blue-950 font-serif">
            IMD 1875
          </span>
        </div>

        {/* Top Header */}
        <div className="mb-6">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 rounded-full bg-blue-950 text-amber-400 flex items-center justify-center border-2 border-amber-500 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <p className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">
            भारत सरकार | Government of India
          </p>
          <p className="text-xs font-semibold text-slate-700">
            पृथ्वी विज्ञान मंत्रालय | Ministry of Earth Sciences
          </p>
          <h2 className="text-xl font-extrabold text-blue-950 tracking-wider font-serif mt-1">
            INDIA METEOROLOGICAL DEPARTMENT
          </h2>
          <div className="inline-block bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-full text-[11px] font-bold text-blue-900 uppercase tracking-widest mt-2">
            CAPACITY CONNECT • DIGITAL CERTIFICATE OF COMPETENCY
          </div>
        </div>

        {/* Certificate Body Text */}
        <div className="my-8 space-y-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            This is to certify that
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b-2 border-amber-400 pb-2 inline-block font-serif px-6">
            {certificate.traineeName}
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            {certificate.traineeDepartment || 'Regional Meteorological Centre, IMD'}
          </p>
          <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
            has successfully fulfilled all rigorous curriculum requirements, practical modules, and
            attained an evaluation grade of{' '}
            <strong className="text-blue-950 font-bold">{certificate.scorePercentage}%</strong> in the
            specialized professional capacity building program:
          </p>
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg max-w-lg mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 font-serif">
              {certificate.courseName}
            </h3>
          </div>
        </div>

        {/* Signatures & Seal Footer */}
        <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-left">
          {/* Trainer Signature */}
          <div className="text-center sm:text-left">
            <div className="font-serif italic font-semibold text-sm text-slate-800 border-b border-slate-400 pb-1 mb-1">
              {certificate.trainerName}
            </div>
            <p className="text-[10px] font-bold uppercase text-slate-700">Course Trainer</p>
            <p className="text-[9px] text-slate-500">Numerical Weather Prediction Division</p>
          </div>

          {/* Central Government Verification Seal */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 bg-amber-50/50 flex flex-col items-center justify-center p-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-0.5" />
              <span className="text-[8px] font-black text-amber-900 tracking-tighter uppercase leading-none">
                IMD SEAL
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-1">Verified Credential</span>
          </div>

          {/* Issue Details & DG Signature */}
          <div className="text-center sm:text-right">
            <div className="font-serif italic font-semibold text-sm text-slate-800 border-b border-slate-400 pb-1 mb-1">
              Dr. M. Mohapatra
            </div>
            <p className="text-[10px] font-bold uppercase text-slate-700">Director General</p>
            <p className="text-[9px] text-slate-500">India Meteorological Department, HQ</p>
          </div>
        </div>

        {/* Verification Footer Bar */}
        <div className="mt-8 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Hash className="w-3 h-3 text-slate-400" />
            <span>Certificate ID: {certificate.certificateId}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>
              Date of Issue: {new Date(certificate.issueDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Verification Code: {certificate.verificationCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
