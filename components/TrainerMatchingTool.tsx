'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Award,
  Star,
  CheckSquare,
  Square,
  Search,
  Filter,
} from 'lucide-react';
import { ITrainerCompetencyMatch } from '@/lib/types';

const AVAILABLE_COMPETENCIES = [
  'Meteorology',
  'Weather Forecasting',
  'Data Analysis',
  'Python',
  'Satellite Meteorology',
  'Climate Science',
  'Numerical Weather Prediction',
];

export default function TrainerMatchingTool() {
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([
    'Meteorology',
    'Weather Forecasting',
    'Data Analysis',
  ]);
  const [matches, setMatches] = useState<ITrainerCompetencyMatch[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async (comps: string[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/trainer-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requiredCompetencies: comps }),
      });
      const data = await res.json();
      if (res.ok) {
        setMatches(data.matches);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(selectedCompetencies);
  }, [selectedCompetencies]);

  const toggleCompetency = (name: string) => {
    if (selectedCompetencies.includes(name)) {
      if (selectedCompetencies.length > 1) {
        setSelectedCompetencies(selectedCompetencies.filter((c) => c !== name));
      }
    } else {
      setSelectedCompetencies([...selectedCompetencies, name]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-900" />
              <span>Trainer Competency Matching System</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent, deterministic evaluation matching subject prerequisites with verified
              trainer faculty competency profiles.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-900 rounded-md shrink-0">
            Official Competency Match Engine
          </span>
        </div>

        {/* Competency Selector Chips */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Required Competencies for Training Assignment:
          </p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COMPETENCIES.map((comp) => {
              const isSelected = selectedCompetencies.includes(comp);
              return (
                <button
                  key={comp}
                  onClick={() => toggleCompetency(comp)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    isSelected
                      ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{comp}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trainer Roster Results */}
      <div className="p-5">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Evaluating trainer faculty matching scores...
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((trainer, idx) => (
              <div
                key={trainer.trainerId}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/20 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Trainer Info */}
                <div className="md:w-5/12">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{trainer.trainerName}</h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{trainer.designation}</p>
                  <p className="text-[11px] text-slate-500">{trainer.department}</p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                    <span>
                      Experience: <strong>{trainer.experienceYears} Years</strong>
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {trainer.rating} / 5.0
                    </span>
                  </div>
                </div>

                {/* Match Matrix Breakdown */}
                <div className="md:w-4/12">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Competency Checklist Breakdown:
                  </p>
                  <div className="space-y-1">
                    {trainer.matchedCompetencies.map((c, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 last:border-none"
                      >
                        <span className="text-slate-700">{c.name}</span>
                        {c.hasCompetency ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Matched ({c.score}%)</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Not listed</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Competency Match Badge */}
                <div className="md:w-3/12 text-center md:text-right md:pl-4 md:border-l border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Competency Match
                  </span>
                  <div
                    className={`inline-block px-3 py-1 rounded-lg font-mono font-extrabold text-xl ${
                      trainer.matchScore >= 80
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : trainer.matchScore >= 60
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {trainer.matchScore}%
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {trainer.matchedCount} of {trainer.totalRequired} requirements
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
