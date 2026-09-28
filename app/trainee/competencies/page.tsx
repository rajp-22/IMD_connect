import { getSessionUser } from '@/lib/auth';
import { getTraineeCompetencies, getSkillGaps } from '@/lib/data-service';
import SkillGapVisualizer from '@/components/SkillGapVisualizer';

export const dynamic = 'force-dynamic';

export default async function TraineeCompetenciesPage() {
  const session = await getSessionUser();
  const userId = session?.id || 'usr_trainee_001';

  const [competencies, skillGaps] = await Promise.all([
    getTraineeCompetencies(userId),
    getSkillGaps(userId),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Competency Mapping & Skill Gap Analysis
        </h1>
        <p className="text-xs text-slate-500">
          Objective algorithmic tracking of your meteorological proficiencies across 7 core IMD
          domains compared with national operational duty standards.
        </p>
      </div>

      <SkillGapVisualizer competencies={competencies} skillGaps={skillGaps} />
    </div>
  );
}
