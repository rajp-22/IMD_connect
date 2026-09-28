'use client';

import React, { useState, useEffect } from 'react';
import { Award, Printer, Eye, Calendar, Hash, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ICertificate } from '@/lib/types';
import CertificateView from '@/components/CertificateView';

export default function TraineeCertificatesPage() {
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<ICertificate | null>(null);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      if (res.ok) {
        setCertificates(data.certificates || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  if (selectedCert) {
    return (
      <div className="space-y-4">
        <CertificateView
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Official Digital Certificates
        </h1>
        <p className="text-xs text-slate-500">
          Permanent verifiable credentials issued by India Meteorological Department under Ministry
          of Earth Sciences.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-xs text-slate-500">Loading issued certificates...</div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                    <Award className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Score: {cert.scorePercentage}%
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base font-serif mb-1">
                  {cert.courseName}
                </h3>
                <p className="text-xs text-slate-600 mb-2">Awarded to: {cert.traineeName}</p>
                <p className="text-[11px] text-slate-500 mb-4">Trainer: {cert.trainerName}</p>

                <div className="space-y-1 py-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span>Certificate ID: {cert.certificateId}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Issued:{' '}
                      {new Date(cert.issueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1 py-2 px-3 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-2xs transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Certificate</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedCert(cert);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-xl border border-slate-200 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Complete 100% of a course&apos;s curriculum and pass the evaluation assessment with at least
            60% to receive your official digital certificate.
          </p>
        </div>
      )}
    </div>
  );
}
