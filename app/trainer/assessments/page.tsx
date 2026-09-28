import Link from 'next/link';
import { FileCheck2, Clock, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { getAssessments } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export default async function TrainerAssessmentsPage() {
  const assessments = await getAssessments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900">
            Assessment Management & Question Banks
          </h1>
          <p className="text-xs text-slate-500">
            Review certification exams, question rubrics, and passing benchmark configurations.
          </p>
        </div>
        <Link
          href="/trainer/courses/create"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950 text-white rounded-lg text-xs font-bold hover:bg-blue-900 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Assessment</span>
        </Link>
      </div>

      <div className="space-y-4">
        {assessments.map((a) => (
          <div key={a._id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  {a.courseTitle}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-serif mt-1">{a.title}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                <span>{a.questions.length} Questions</span>
                <span>Passing: {a.passingPercentage}%</span>
                <span>{a.durationMinutes} Mins</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4">{a.description}</p>

            {/* Question Breakdown Preview */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Question Sample:
              </p>
              {a.questions.slice(0, 2).map((q, idx) => (
                <div key={q.id} className="p-2.5 bg-slate-50 rounded text-xs">
                  <div className="font-semibold text-slate-800">
                    Q{idx + 1}. {q.questionText}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                    Correct: Option {String.fromCharCode(65 + q.correctAnswerIndex)} (
                    {q.options[q.correctAnswerIndex]})
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
