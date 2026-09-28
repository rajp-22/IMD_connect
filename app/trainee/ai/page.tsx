import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CapacityAIAssistant from '@/components/CapacityAIAssistant';
import { Brain, Sparkles, ShieldCheck } from 'lucide-react';

export default async function TraineeAIPage() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Capacity AI — Learning Assistant
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grounded pedagogical intelligence tailored to IMD meteorological curriculum and operational standards.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Curriculum Guardrails Active</span>
        </div>
      </div>

      <CapacityAIAssistant initialMode="chat" />
    </div>
  );
}
