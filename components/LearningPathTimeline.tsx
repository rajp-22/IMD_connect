'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  CircleDot,
  ArrowRight,
  Lock,
  Clock,
  Target,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react';
import { ILearningPath, ILearningPathStep } from '@/lib/types';

interface LearningPathTimelineProps {
  learningPath: ILearningPath;
  onAdvanceStep?: (stepId: string) => void;
}

export default function LearningPathTimeline({
  learningPath,
  onAdvanceStep,
}: LearningPathTimelineProps) {
  const getStepIcon = (status: ILearningPathStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />;
      case 'current':
        return <CircleDot className="w-5 h-5 text-blue-700 animate-pulse fill-blue-100" />;
      case 'in-progress':
        return <ArrowRight className="w-5 h-5 text-amber-600" />;
      case 'locked':
      default:
        return <Lock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStepBadge = (status: ILearningPathStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'current':
        return 'bg-blue-50 text-blue-900 border-blue-300 font-bold';
      case 'in-progress':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'locked':
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Path Goal Header */}
      <div className="p-6 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider bg-white/10 px-2 py-0.5 rounded text-amber-300 border border-white/20">
                Personalized Learning Sequence
              </span>
              <span className="text-xs text-blue-200">Target: {learningPath.targetRole}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
              {learningPath.title}
            </h2>
            <p className="text-xs text-blue-200 max-w-2xl flex items-center gap-1.5 pt-1">
              <Target className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Goal: {learningPath.goal}</span>
            </p>
          </div>

          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 text-center sm:min-w-[140px] shrink-0">
            <div className="text-2xl font-extrabold text-amber-400 font-mono">
              {learningPath.progress}%
            </div>
            <div className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
              Journey Progress
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${learningPath.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-200">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              Est. Duration: <strong>{learningPath.estimatedDuration}</strong>
            </span>
            <span>•</span>
            <span>
              Current Stage: <strong>Step {learningPath.currentStep} of {learningPath.steps.length}</strong>
            </span>
          </div>
          <div>
            Next Recommended Step:{' '}
            <strong className="text-amber-300">{learningPath.nextRecommendedStep}</strong>
          </div>
        </div>
      </div>

      {/* Sequential Steps List */}
      <div className="p-6 divide-y divide-slate-100">
        {learningPath.steps.map((step, idx) => {
          const isLocked = step.status === 'locked';

          return (
            <div
              key={step.id}
              className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                step.status === 'current'
                  ? 'bg-blue-50/50 p-4 rounded-xl border border-blue-200 my-2'
                  : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="pt-0.5 shrink-0">{getStepIcon(step.status)}</div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{step.title}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${getStepBadge(
                        step.status
                      )}`}
                    >
                      {step.status === 'completed'
                        ? 'Completed'
                        : step.status === 'current'
                        ? 'Current Step'
                        : step.status === 'in-progress'
                        ? 'In Progress'
                        : 'Prerequisite Locked'}
                    </span>
                    {step.score !== undefined && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        Score: {step.score}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 max-w-xl">{step.description}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                    <span>Duration: {step.duration}</span>
                    <span>•</span>
                    <span className="capitalize">{step.type}</span>
                    {step.completedAt && (
                      <>
                        <span>•</span>
                        <span>Completed on {new Date(step.completedAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 pl-8 sm:pl-0">
                {step.status === 'completed' ? (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Passed
                  </span>
                ) : step.status === 'current' || step.status === 'in-progress' ? (
                  <Link
                    href={`/courses/${step.courseId}`}
                    className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                  >
                    <span>Continue Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
