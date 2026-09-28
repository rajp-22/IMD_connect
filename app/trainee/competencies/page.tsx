import { getSessionUser } from '@/lib/auth';
import {
  getTraineeCompetencies,
  getSkillGaps,
  getRoleTemplates,
  compareTraineeToRole,
} from '@/lib/data-service';
import SkillGapVisualizer from '@/components/SkillGapVisualizer';
import RoleMatrixCompare from '@/components/RoleMatrixCompare';
import CompetencyGraph from '@/components/CompetencyGraph';
import { Compass, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TraineeCompetenciesPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const session = await getSessionUser();
  const userId = session?.id || 'usr_trainee_001';

  const { role: roleParam } = await searchParams;
  const roleCode = roleParam || 'WF-CORE';

  const [competencies, skillGaps, roles, activeComparison] = await Promise.all([
    getTraineeCompetencies(userId),
    getSkillGaps(userId),
    getRoleTemplates(),
    compareTraineeToRole(userId, roleCode),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-blue-900" />
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
            Competency Intelligence Engine & Role Matrix
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Objective algorithmic tracking of your meteorological proficiencies across 10 core IMD domains, role requirement comparisons, and interactive knowledge graph.
        </p>
      </div>

      {/* Feature 2: Role-Based Competency Matrix */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-900" />
          <h2 className="text-base font-bold text-slate-900 font-serif">
            Role-Based Competency Matrix & Gap Identification
          </h2>
        </div>
        <RoleMatrixCompare
          roles={roles}
          activeComparison={activeComparison as any}
        />
      </section>

      {/* Feature 19: Interactive Visual Knowledge / Competency Graph */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-900" />
          <h2 className="text-base font-bold text-slate-900 font-serif">
            Visual Competency & Curriculum Knowledge Graph
          </h2>
        </div>
        <CompetencyGraph />
      </section>

      {/* Feature 1 & 3: Competency Scores & Smart Skill Gap Analysis */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-900" />
          <h2 className="text-base font-bold text-slate-900 font-serif">
            Individual Competency Baseline & Priority Skill Gaps
          </h2>
        </div>
        <SkillGapVisualizer competencies={competencies} skillGaps={skillGaps} />
      </section>
    </div>
  );
}
