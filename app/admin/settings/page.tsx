'use client';

import React, { useState } from 'react';
import { Sliders, Database, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = async () => {
    if (
      !confirm(
        'Are you sure you want to reset all platform data back to the clean official prototype seed state?'
      )
    ) {
      return;
    }

    setResetting(true);
    setResetSuccess(false);

    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 4000);
      } else {
        alert('Failed to reset data.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Platform Configuration & Database Layer
        </h1>
        <p className="text-xs text-slate-500">
          System environment parameters, MongoDB connection layer, and prototype seed reset controls.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform data successfully re-seeded to initial prototype state.</span>
        </div>
      )}

      {/* Database Connection Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Database className="w-4 h-4 text-blue-900" />
          <span>Database & Environment Configuration</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="font-bold text-slate-800">Storage Architecture</span>
              <p className="text-slate-500 text-[11px]">
                Dual-Mode: Mongoose connection with resilient local JSON persistence fallback.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
              OPERATIONAL
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="font-bold text-slate-800">Deployment Mandate</span>
              <p className="text-slate-500 text-[11px]">
                IMD Centralized MeghSetu Portal • Ministry of Earth Sciences
              </p>
            </div>
            <span className="font-mono text-slate-600 text-[11px]">PROD-2026</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="font-bold text-slate-800">Session Security</span>
              <p className="text-slate-500 text-[11px]">
                Signed JWT with HTTP-only cookies & role-based middleware guards
              </p>
            </div>
            <span className="font-mono text-slate-600 text-[11px]">HMAC-SHA256</span>
          </div>
        </div>
      </div>

      {/* Database Seed Management */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <RotateCcw className="w-4 h-4 text-amber-600" />
          <span>Demo Data Management</span>
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          Restore the database back to standard demonstration state with seeded courses (Weather
          Forecasting Fundamentals, Satellite Meteorology, Python for Meteorological Data Analysis),
          demo assessments, competency matrices, and test accounts.
        </p>

        <button
          onClick={handleResetData}
          disabled={resetting}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-xs transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resetting ? 'Resetting Data...' : 'Reset & Re-Seed Demo Data'}</span>
        </button>
      </div>
    </div>
  );
}
