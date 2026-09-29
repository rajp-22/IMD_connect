'use client';

import React from 'react';
import {
  Award,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Hash,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { ICertificate } from '@/lib/types';

interface CertificateViewProps {
  certificate: ICertificate;
  onClose?: () => void;
}

export default function CertificateView({ certificate, onClose }: CertificateViewProps) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(certificate.issueDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-slate-100 p-4 sm:p-8 rounded-2xl max-w-4xl mx-auto my-6 shadow-md border border-slate-300">
      {/* Controls Bar (hidden during printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-300 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200">
            <Award className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-serif">
              Digital Certificate of Competency
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              ID: {certificate.certificateId} • Verified Credential
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="btn-primary py-2 px-3.5 text-xs shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="btn-secondary py-2 px-3 text-xs"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Official Certificate Paper Frame */}
      <div className="certificate-frame bg-white border-8 border-double border-blue-950 p-8 sm:p-14 relative shadow-xl text-center rounded-xs overflow-hidden">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-[130px] font-black uppercase text-blue-950 font-serif">
            IMD 1875
          </span>
        </div>

        {/* Prototype Disclaimer Ribbon */}
        <div className="absolute top-3 right-3 bg-amber-100 border border-amber-300 text-amber-900 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded tracking-wider no-print">
          Evaluation Prototype Record
        </div>

        {/* Top Header */}
        <div className="mb-6">
          <div className="flex justify-center mb-3">
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
          <h2 className="text-xl sm:text-2xl font-extrabold text-blue-950 tracking-wider font-serif mt-1">
            INDIA METEOROLOGICAL DEPARTMENT
          </h2>
          <div className="inline-block bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full text-[10px] font-bold text-blue-900 uppercase tracking-widest mt-2">
            MEGHSETU • DIGITAL CERTIFICATE OF COMPETENCY
          </div>
        </div>

        {/* Certificate Body Text */}
        <div className="my-8 space-y-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            This is to certify that
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 border-b-2 border-amber-400 pb-2 inline-block font-serif px-8">
            {certificate.traineeName}
          </h1>
          <p className="text-xs text-slate-600 font-medium font-mono">
            {certificate.traineeDepartment || 'Regional Meteorological Centre, IMD'}
          </p>
          <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
            has successfully fulfilled all rigorous curriculum requirements, practical modules, and
            attained an evaluation grade of{' '}
            <strong className="text-blue-950 font-bold">{certificate.scorePercentage}%</strong> in the
            specialized professional capacity building program:
          </p>
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl max-w-lg mx-auto">
            <h3 className="text-base sm:text-xl font-bold text-blue-950 font-serif">
              {certificate.courseName}
            </h3>
          </div>
        </div>

        {/* Signatures & QR Verification Section */}
        <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-left">
          {/* Trainer Signature */}
          <div className="text-center sm:text-left">
            <div className="font-serif italic font-semibold text-sm text-slate-800 border-b border-slate-400 pb-1 mb-1">
              {certificate.trainerName}
            </div>
            <p className="text-[10px] font-bold uppercase text-slate-700">Course Trainer</p>
            <p className="text-[9px] text-slate-500">Numerical Weather Prediction Division</p>
          </div>

          {/* Central Government Verification Seal & QR Code Block */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs mb-1 flex items-center justify-center">
              {/* Simulated crisp QR verification code */}
              <div className="w-16 h-16 bg-white border border-slate-300 p-1 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                  <path d="M40,10 h10 v10 h-10 z M60,10 h10 v10 h-10 z" />
                  <path d="M40,40 h20 v20 h-20 z" />
                  <path d="M10,40 h10 v20 h-10 z M40,70 h10 v20 h-10 z M70,40 h20 v10 h-20 z M80,60 h20 v10 h-20 z M70,80 h20 v20 h-20 z" />
                </svg>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-600">Scan to Verify</span>
            <span className="text-[8px] font-mono text-slate-400 mt-0.5">Code: {certificate.verificationCode}</span>
          </div>

          {/* DG Signature */}
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
            <span>Date of Issue: {formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>IMD Authenticated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
