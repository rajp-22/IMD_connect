import { getUsers, getAllTrainers } from '@/lib/data-service';
import { Award, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminTrainersPage() {
  const [users, trainers] = await Promise.all([getUsers(), getAllTrainers()]);
  const trainerUsers = users.filter((u) => u.role === 'trainer');

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Certified Trainers & Instructor Faculty Roster
        </h1>
        <p className="text-xs text-slate-500">
          Accredited senior meteorologists, NWP scientists, and remote sensing specialists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainerUsers.map((t) => {
          const profile = trainers.find((p) => p.userId === t._id);
          return (
            <div
              key={t._id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-950 text-white font-serif font-bold text-sm flex items-center justify-center">
                    {t.name.charAt(0)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      t.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm font-serif">{t.name}</h3>
                <p className="text-xs text-blue-900 font-medium mb-1">{t.designation}</p>
                <p className="text-[11px] text-slate-500 mb-3">{t.department}</p>

                <div className="grid grid-cols-2 gap-2 text-center p-2.5 bg-slate-50 rounded-lg text-xs font-mono mb-3">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 block">Experience</span>
                    <span className="font-bold text-slate-800">
                      {profile?.experienceYears || 10} Yrs
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 block">Rating</span>
                    <span className="font-bold text-amber-600 flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {profile?.rating || 4.9}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {profile?.competencies.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-blue-50 text-blue-900 border border-blue-100 rounded text-[10px] font-medium"
                      >
                        {c.name} ({c.score}%)
                      </span>
                    ))}
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
