import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getLearningPathByUserId } from '@/lib/data-service';
import LearningPathTimeline from '@/components/LearningPathTimeline';
import { GitFork, Info } from 'lucide-react';

export default async function TraineeLearningPathPage() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') {
    redirect('/login');
  }

  const learningPath = await getLearningPathByUserId(session.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Personalized Learning Path
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sequenced progression designed to systematically close your identified competency gaps.
          </p>
        </div>
      </div>

      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-800 shrink-0" />
        <span>
          <strong>Sequence Logic:</strong> Each step unlocks automatically once prior prerequisite courses and milestone assessments are completed.
        </span>
      </div>

      {learningPath ? (
        <LearningPathTimeline learningPath={learningPath} />
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          No learning path initialized. Please consult your administrator or select a target role in Competencies.
        </div>
      )}
    </div>
  );
}
