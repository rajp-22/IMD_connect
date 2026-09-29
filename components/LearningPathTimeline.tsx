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
  ChevronDown,
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
  const getStepNode = (status: ILearningPathStep['status'], idx: number) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-600 text-emerald-700 flex items-center justify-center font-bold text-xs shadow-xs z-10">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        );
      case 'current':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-950 border-2 border-amber-400 text-white flex items-center justify-center font-bold text-xs shadow-md z-10 animate-pulse">
            <CircleDot className="w-4 h-4 text-amber-400" />
          </div>
        );
      case 'in-progress':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-800 flex items-center justify-center font-bold text-xs shadow-xs z-10">
            <span className="font-mono">{idx + 1}</span>
          </div>
        );
      case 'locked':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold text-xs z-10">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
          </div>
        );
    }
  };

  const getStepBadge = (status: ILearningPathStep['status']) => {
    switch (status) {
      case 'completed':
        return 'badge-status-completed';
      case 'current':
        return 'badge-status-active font-bold';
      case 'in-progress':
        return 'badge-status-pending';
      case 'locked':
      default:
        return 'badge-status-locked';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Path Goal Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider bg-white/10 px-2.5 py-0.5 rounded text-amber-300 border border-white/20 font-bold">
                Government Learning Roadmap
              </span>
              <span className="text-xs text-blue-200">Target Role: <strong>{learningPath.targetRole}</strong></span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
              {learningPath.title}
            </h2>
            <p className="text-xs text-blue-200 max-w-2xl flex items-center gap-1.5 pt-1">
              <Target className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Goal: {learningPath.goal}</span>
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/15 text-center sm:min-w-[150px] shrink-0 backdrop-blur-xs">
            <div className="text-2xl font-extrabold text-amber-400 font-mono">
              {learningPath.progress}%
            </div>
            <div className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
              Roadmap Progress
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2.5 overflow-hidden">
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
            Next Recommended Milestone:{' '}
            <strong className="text-amber-300">{learningPath.nextRecommendedStep}</strong>
          </div>
        </div>
      </div>

      {/* Connected Journey Sequence */}
      <div className="p-6 sm:p-8 space-y-0 relative">
        {learningPath.steps.map((step, idx) => {
          const isLast = idx === learningPath.steps.length - 1;
          const isCurrent = step.status === 'current';

          return (
            <div key={step.id} className="relative flex items-start gap-4 pb-8 group">
              {/* Connecting vertical line & downward arrow indicator */}
              {!isLast && (
                <div className="absolute left-4 top-8 -bottom-2 w-0.5 bg-slate-200 flex flex-col justify-end items-center">
                  <ChevronDown className="w-3 h-3 text-slate-400 -mb-1 bg-white" />
                </div>
              )}

              {/* Node Indicator */}
              <div className="shrink-0">{getStepNode(step.status, idx)}</div>

              {/* Step Card Content */}
              <div
                className={`flex-1 p-4 sm:p-5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Step {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 font-serif">
                        {step.title}
                      </h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${getStepBadge(step.status)}`}>
                        {step.status === 'completed'
                          ? 'Completed ✓'
                          : step.status === 'current'
                          ? 'Current Step ●'
                          : step.status === 'in-progress'
                          ? 'In Progress ⏳'
                          : 'Prerequisite Locked 🔒'}
                      </span>
                      {step.score !== undefined && (
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                          Score: {step.score}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                      {step.description}
                    </p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                      <span>Duration: {step.duration}</span>
                      <span>•</span>
                      <span className="capitalize">{step.type}</span>
                      {step.completedAt && (
                        <>
                          <span>•</span>
                          <span>Passed on {new Date(step.completedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 self-start sm:self-center">
                    {step.status === 'completed' ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mastered</span>
                      </span>
                    ) : step.status === 'current' || step.status === 'in-progress' ? (
                      <Link
                        href={`/courses/${step.courseId}`}
                        className="btn-primary py-2 px-3.5 text-xs font-semibold"
                      >
                        <span>Continue Step</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Prerequisite Locked</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
