import { MessageSquare, Star, User } from 'lucide-react';
import { getFeedbacks } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export default async function TrainerFeedbackPage() {
  const feedbacks = await getFeedbacks();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Aggregated Course Feedback & Reviews
        </h1>
        <p className="text-xs text-slate-500">
          Evaluations submitted by certified officers after completing curriculum modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbacks.map((fb) => (
          <div
            key={fb._id}
            className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-blue-900">{fb.courseTitle}</span>
              <span className="flex items-center gap-1 font-mono font-bold text-amber-600 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {fb.rating}.0 / 5.0
              </span>
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed my-3">
              &ldquo;{fb.comments}&rdquo;
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Officer: {fb.traineeName}</span>
              <span>
                {new Date(fb.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
