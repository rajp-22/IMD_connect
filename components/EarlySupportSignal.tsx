'use client';

import React from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  BookOpen,
  ArrowRight,
  Brain,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { ICourse } from '@/lib/types';

interface EarlySupportSignalProps {
  needsSupport?: boolean;
  recentScores?: number[];
  recommendedRemedialCourses?: ICourse[];
  guidanceMessage?: string;
}

export default function EarlySupportSignal({
  needsSupport = true,
  recentScores = [72, 58, 49, 43],
  recommendedRemedialCourses = [],
  guidanceMessage,
}: EarlySupportSignalProps) {
  if (!needsSupport) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs">
          <HeartHandshake className="w-5 h-5 text-amber-400" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              Learning Guidance & Support
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.2 rounded">
              Confidential to Trainee
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            &ldquo;Additional learning support may be useful.&rdquo;
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            {guidanceMessage ||
              'Based on your recent assessment attempts, reviewing foundational meteorological thermodynamics and synoptic observation guidelines can help solidify core concepts.'}
          </p>
        </div>
      </div>

      {/* Recommended Support Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <Link
          href="/trainee/ai"
          className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 text-left transition flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <Brain className="w-4 h-4 text-blue-900 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                Capacity AI Revision
              </div>
              <div className="text-[10px] text-slate-500">Practice concept questions</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900" />
        </Link>

        <Link
          href="/courses/weather-forecasting-fundamentals?lesson=les_1_1_1"
          className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 text-left transition flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                Revisit Module Notes
              </div>
              <div className="text-[10px] text-slate-500">Thermodynamics refresher</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900" />
        </Link>

        <Link
          href="/courses/weather-observation-and-surface-instrumentation"
          className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 text-left transition flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                Remedial Course
              </div>
              <div className="text-[10px] text-slate-500">Surface Observation Basics</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900" />
        </Link>
      </div>
    </div>
  );
}
