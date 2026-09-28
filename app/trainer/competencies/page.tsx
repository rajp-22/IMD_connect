import TrainerMatchingTool from '@/components/TrainerMatchingTool';

export default function TrainerCompetenciesPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Trainer Competency Matching System
        </h1>
        <p className="text-xs text-slate-500">
          Transparent evaluation engine matching required syllabus proficiencies against certified
          IMD instructor capabilities.
        </p>
      </div>

      <TrainerMatchingTool />
    </div>
  );
}
