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
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Central Registry of Digital Certificates Issued
        </h1>
        <p className="text-xs text-slate-500">
          Cryptographically referenced digital competency certificates issued to IMD officers.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Total Verifiable Credentials: {certificates.length}
          </span>
          <span className="text-slate-500 font-mono">Government Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Recipient Trainee</th>
                <th className="py-3 px-4">Curriculum</th>
                <th className="py-3 px-4">Course Trainer</th>
                <th className="py-3 px-4">Exam Score</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {certificates.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-950">{c.certificateId}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{c.traineeName}</div>
                    <div className="text-[10px] text-slate-500">{c.traineeDepartment}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{c.courseName}</td>
                  <td className="py-3 px-4 text-slate-600">{c.trainerName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                    {c.scorePercentage}%
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {new Date(c.issueDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCert(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-2xs"
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
      </div>
    </div>
  );
}
