'use client';

import React, { useState, useEffect } from 'react';
import { Award, Eye, Printer, Hash, Calendar, ShieldCheck } from 'lucide-react';
import { ICertificate } from '@/lib/types';
import CertificateView from '@/components/CertificateView';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<ICertificate | null>(null);

  useEffect(() => {
    fetch('/api/certificates')
      .then((res) => res.json())
      .then((data) => {
        if (data.certificates) setCertificates(data.certificates);
      })
      .finally(() => setLoading(false));
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
        <div className="flex items-center gap-2.5">
          <Award className="w-6 h-6 text-blue-900" />
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
            Central Registry of Digital Certificates Issued
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Cryptographically referenced digital competency certificates issued to IMD officers across all operational cadres.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Total Verifiable Credentials: {certificates.length}
          </span>
          <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Government Verified Registry
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-48 bg-slate-200 rounded skeleton-pulse" />
              <div className="h-4 w-24 bg-slate-200 rounded skeleton-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg skeleton-pulse" />
              ))}
            </div>
          </div>
        ) : certificates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Certificate ID</th>
                  <th className="py-3.5 px-4">Recipient Trainee</th>
                  <th className="py-3.5 px-4">Curriculum</th>
                  <th className="py-3.5 px-4">Course Trainer</th>
                  <th className="py-3.5 px-4">Exam Score</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-950">{c.certificateId}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.traineeName}</div>
                      <div className="text-[10px] text-slate-500">{c.traineeDepartment}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{c.courseName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.trainerName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {c.scorePercentage}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {new Date(c.issueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCert(c)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-2xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">No Certificates Issued Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Certificates will appear in this central ledger once trainees successfully complete and pass their final evaluation examinations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
