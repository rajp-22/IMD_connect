import { Megaphone, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import { getAnnouncements } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export default async function TraineeAnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Official IMD Capacity Announcements
        </h1>
        <p className="text-xs text-slate-500">
          Direct circulars, pre-monsoon workshops, and technical advisories from IMD Headquarters.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann._id}
            className={`p-5 rounded-xl border bg-white shadow-2xs transition ${
              ann.priority === 'high' ? 'border-amber-400/80 bg-amber-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    ann.priority === 'high'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}
                >
                  {ann.type}
                </span>
                {ann.priority === 'high' && (
                  <span className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    High Priority
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(ann.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2 font-serif">{ann.title}</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{ann.content}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Issued by: {ann.author}</span>
              <span className="font-mono text-slate-400">Ref: IMD-TRG-2026</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
