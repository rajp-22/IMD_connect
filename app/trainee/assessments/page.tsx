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
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { IAssessment, IAssessmentAttempt, ICertificate } from '@/lib/types';
import AssessmentRunner from '@/components/AssessmentRunner';
import CertificateView from '@/components/CertificateView';

export default function TraineeAssessmentsPage() {
  const [assessments, setAssessments] = useState<IAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAssessment, setActiveAssessment] = useState<IAssessment | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<ICertificate | null>(null);

  // Pre-test vs Post-test comparison state (Feature 6 & 7)
  const comparisonData = {
    courseTitle: 'Weather Forecasting Fundamentals',
    preTestScore: 42,
    postTestScore: 81,
    improvement: 39,
  };

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
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-6 h-6 text-blue-900" />
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
            Pre-Assessments & Final Certification Exams
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Measure your learning progression with baseline pre-tests and post-course certification examinations.
        </p>
      </div>

      {/* Feature 6 & 7: Pre-Test vs Post-Test Comparison Card */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-blue-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
              Learning Outcome Impact
            </span>
            <h2 className="text-lg font-bold text-white">
              {comparisonData.courseTitle}
            </h2>
            <p className="text-xs text-blue-200 max-w-xl">
              Baseline diagnostic pre-assessment compared against final certification evaluation.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white/10 p-4 rounded-xl border border-white/15 backdrop-blur-xs shrink-0">
            <div className="text-center">
              <div className="text-[11px] text-slate-300 uppercase font-semibold">Pre-Test</div>
              <div className="text-2xl font-bold text-slate-200 font-mono mt-0.5">
                {comparisonData.preTestScore}%
              </div>
            </div>
            <div className="text-amber-400 font-bold text-lg">→</div>
            <div className="text-center">
              <div className="text-[11px] text-slate-300 uppercase font-semibold">Post-Test</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-0.5">
                {comparisonData.postTestScore}%
              </div>
            </div>
            <div className="pl-3 border-l border-white/20 text-center">
              <div className="text-[10px] text-amber-300 uppercase font-bold">Net Gain</div>
              <div className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5">
                +{comparisonData.improvement} pts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Assessments List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-serif">
          Certification Evaluations
        </h2>

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
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                        a.assessmentType === 'pre'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {a.assessmentType === 'pre' ? 'Diagnostic Pre-Test' : 'Final Post-Test'} •{' '}
                      {a.questions?.length || 5} Questions
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {a.durationMinutes} Mins
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{a.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.description}</p>
                  <p className="text-[11px] text-blue-950 font-semibold mt-2">
                    Course: {a.courseTitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Pass criteria: <strong>{a.passingPercentage}%</strong>
                  </div>
                  <button
                    onClick={() => setActiveAssessment(a)}
                    className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            No published assessments available.
          </div>
        )}
      </div>
    </div>
  );
}
