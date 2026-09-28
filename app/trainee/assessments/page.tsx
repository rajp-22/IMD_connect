'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { IAssessment, IAssessmentAttempt, ICertificate } from '@/lib/types';
import AssessmentRunner from '@/components/AssessmentRunner';
import CertificateView from '@/components/CertificateView';

export default function TraineeAssessmentsPage() {
  const [assessments, setAssessments] = useState<IAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAssessment, setActiveAssessment] = useState<IAssessment | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<ICertificate | null>(null);

  const fetchAssessments = async () => {
    try {
      const res = await fetch('/api/assessments');
      const data = await res.json();
      if (res.ok) {
        setAssessments(data.assessments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleAssessmentComplete = (attempt: IAssessmentAttempt, cert?: ICertificate) => {
    if (cert) {
      setActiveCertificate(cert);
    }
  };

  if (activeCertificate) {
    return (
      <div className="space-y-4">
        <CertificateView
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      </div>
    );
  }

  if (activeAssessment) {
    return (
      <div className="space-y-4">
        <AssessmentRunner
          assessment={activeAssessment}
          onComplete={handleAssessmentComplete}
          onCancel={() => setActiveAssessment(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Evaluations & MCQ Assessments
        </h1>
        <p className="text-xs text-slate-500">
          Formal meteorological certification assessments. Achieving a passing grade automatically
          generates your verified digital certificate of competency.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-xs text-slate-500">Loading assessments...</div>
      ) : assessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((a) => (
            <div
              key={a._id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono">
                    {a.questions?.length || 5} Questions
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {a.durationMinutes} Mins
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base font-serif mb-1">{a.title}</h3>
                <p className="text-xs text-blue-900 font-medium mb-2">{a.courseTitle}</p>
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {a.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 font-mono">
                  <span>Passing Mark: {a.passingPercentage}%</span>
                  <span>Trainer: {a.trainerName}</span>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => setActiveAssessment(a)}
                  className="w-full py-2 px-3 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
          No assessments currently available.
        </div>
      )}
    </div>
  );
}
