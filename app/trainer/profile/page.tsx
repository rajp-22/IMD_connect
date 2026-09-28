import { getSessionUser } from '@/lib/auth';
import { getTrainerProfile } from '@/lib/data-service';
import { User, Award, BookOpen, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TrainerProfilePage() {
  const session = await getSessionUser();
  const trainerId = session?.id || 'usr_trainer_001';
  const profile = await getTrainerProfile(trainerId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Trainer Faculty Profile & Competencies
        </h1>
        <p className="text-xs text-slate-500">
          Official instructor credentials, specialization domains, and verified competency
          benchmarks.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-200">
          <div className="w-16 h-16 rounded-full bg-blue-950 text-amber-400 text-xl font-bold font-serif flex items-center justify-center shrink-0 shadow-md">
            {profile?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              {profile?.name || 'Dr. Rajesh Sharma'}
            </h2>
            <p className="text-xs text-blue-900 font-semibold">{profile?.designation}</p>
            <p className="text-xs text-slate-500">{profile?.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Experience
            </span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {profile?.experienceYears || 14} Years
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Courses Authored
            </span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {profile?.totalCourses || 2}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Officers Taught
            </span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {profile?.totalStudentsTaught || 142}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Faculty Rating
            </span>
            <span className="text-lg font-bold font-mono text-amber-600 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              {profile?.rating || 4.9}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Professional Summary
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
            {profile?.bio ||
              'Over 14 years of research and operational weather forecasting leadership at IMD HQ. Specialized in synoptic analysis, NWP models (WRF, GFS), and training national forecasters.'}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Verified Faculty Competency Scores (Matching Matrix)
          </h3>
          <div className="space-y-2">
            {profile?.competencies.map((c, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900">{c.name}</span>
                  <span className="text-slate-500 ml-2 font-mono text-[11px]">({c.domain})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-900 font-mono">{c.score}%</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {c.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
