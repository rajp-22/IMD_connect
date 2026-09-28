import { getCompetencies } from '@/lib/data-service';
import { Compass, Target, Award, Sparkles } from 'lucide-react';
import TrainerMatchingTool from '@/components/TrainerMatchingTool';

export const dynamic = 'force-dynamic';

export default async function AdminCompetenciesPage() {
  const competencies = await getCompetencies();

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Organizational Competency Framework & Trainer Matching
        </h1>
        <p className="text-xs text-slate-500">
          Standardized skill domain benchmarks and transparent instructor competency matching
          engine for IMD divisions.
        </p>
      </div>

      {/* Trainer Competency Matching Engine (Requirement 14) */}
      <section>
        <TrainerMatchingTool />
      </section>

      {/* Core Competency Benchmarks (Requirement 12 & 13) */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-900" />
              <span>Defined Meteorological Competencies & Operational Benchmarks</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Target operational proficiency scores expected across IMD observational cadres.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
            7 Core Domains
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {competencies.map((comp) => (
            <div
              key={comp._id}
              className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="sm:w-2/3">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{comp.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-mono">
                    {comp.category}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{comp.description}</p>
              </div>

              <div className="sm:w-1/3 sm:text-right font-mono sm:pl-4 sm:border-l border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Target Benchmark
                </span>
                <span className="text-lg font-extrabold text-blue-950">
                  {comp.targetBenchmark}%
                </span>
                <span className="text-[10px] text-slate-500 block">Proficiency Required</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
