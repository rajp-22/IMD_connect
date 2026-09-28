import { FileCheck2, Clock, CheckCircle2 } from 'lucide-react';
import { getAssessments } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export default async function AdminAssessmentsPage() {
  const assessments = await getAssessments();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Central Assessment Oversight
        </h1>
        <p className="text-xs text-slate-500">
          Auditing qualification rubrics, question distributions, and passing percentage thresholds.
        </p>
      </div>

      <div className="space-y-4">
        {assessments.map((a) => (
          <div key={a._id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  {a.courseTitle}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-serif mt-1">{a.title}</h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
                <span>Total Marks: {a.totalMarks}</span>
                <span className="font-bold text-blue-900">Passing: {a.passingPercentage}%</span>
                <span>Duration: {a.durationMinutes} Mins</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3">{a.description}</p>

            <div className="text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-100">
              Trainer Author: {a.trainerName} • Total Questions: {a.questions.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
