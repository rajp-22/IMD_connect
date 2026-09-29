'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Compass,
  BarChart3,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { ITraineeProfile } from '@/lib/types';

export default function TraineeProfilePage() {
  const [profile, setProfile] = useState<(ITraineeProfile & { name?: string; email?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Edit states
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [interestsStr, setInterestsStr] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/trainees/profile');
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        setBio(data.profile.bio || '');
        setDepartment(data.profile.department || '');
        setDesignation(data.profile.designation || '');
        setPhone(data.profile.phone || '');
        setSkillsStr((data.profile.skills || []).join(', '));
        setInterestsStr((data.profile.interests || []).join(', '));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const interests = interestsStr
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/trainees/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          department,
          designation,
          phone,
          skills,
          interests,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-4">
        <div className="skeleton-pulse h-32 w-full rounded-2xl" />
        <div className="skeleton-pulse h-48 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. PROFESSIONAL IDENTITY HEADER */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-blue-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-900/80 border-2 border-amber-400 text-amber-300 text-2xl font-bold font-serif flex items-center justify-center shrink-0 shadow-md">
              {profile?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="badge-status-completed bg-blue-900/90 text-amber-300 border-blue-700/60 font-mono">
                  Operational Cadre
                </span>
                <span className="text-xs text-blue-200 font-mono">IMD HQ Verified</span>
              </div>
              <h1 className="text-2xl font-bold font-serif">{profile?.name || 'Pooja Iyer'}</h1>
              <p className="text-xs text-blue-200 mt-0.5">
                {designation || profile?.designation || 'Scientific Assistant-I'} •{' '}
                {department || profile?.department || 'RMC Mumbai, Regional Meteorological Centre'}
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold animate-in fade-in self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile Saved</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 2. ABOUT & OFFICIAL ASSIGNMENT */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
            <User className="w-4 h-4 text-blue-900" />
            <span>2. Official Cadre Assignment & About</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Regional Center / Division
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-gov"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cadre Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="input-gov"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-gov font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Station Email
              </label>
              <div className="input-gov bg-slate-50 text-slate-500 font-mono">
                {profile?.email || 'trainee@capacityconnect.demo'}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Professional Background & Operational Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-gov"
              />
            </div>
          </div>
        </div>

        {/* 3. PROFESSIONAL EXPERIENCE */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
            <Briefcase className="w-4 h-4 text-blue-900" />
            <span>3. Operational Experience</span>
          </h2>

          <div className="space-y-3">
            {(profile?.experience || [
              { position: 'Observational Data Analyst', organization: 'RMC Mumbai', years: 2 },
              { position: 'Trainee Meteorologist', organization: 'IMD Pune Training Division', years: 1 },
            ]).map((exp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900 font-serif">{exp.position}</h3>
                  <p className="text-slate-600">{exp.organization}</p>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                  {exp.years} Years
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ACADEMIC EDUCATION */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
            <GraduationCap className="w-4 h-4 text-blue-900" />
            <span>4. Academic Education & Qualifications</span>
          </h2>

          <div className="space-y-3">
            {(profile?.education || [
              { degree: 'M.Sc. Atmospheric Science', institution: 'University of Pune', qualification: 'Meteorology', year: 2023 },
              { degree: 'B.Sc. Physics & Mathematics', institution: 'Mumbai University', qualification: 'Physical Sciences', year: 2021 },
            ]).map((edu, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900 font-serif">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.institution}</p>
                  <p className="text-[11px] text-blue-900 font-medium">Specialization: {edu.qualification}</p>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. SKILLS & SCIENTIFIC INTERESTS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
            <Sparkles className="w-4 h-4 text-blue-900" />
            <span>5. Technical Skills & Focus Areas</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Technical Skills (Comma separated)
              </label>
              <input
                type="text"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="Python, Synoptic Chart Analysis, Radar Data Plotting"
                className="input-gov font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Scientific Research Interests (Comma separated)
              </label>
              <input
                type="text"
                value={interestsStr}
                onChange={(e) => setInterestsStr(e.target.value)}
                placeholder="Monsoon Depressions, Severe Thunderstorm Nowcasting, INSAT Payloads"
                className="input-gov font-mono"
              />
            </div>
          </div>
        </div>

        {/* 6. COMPETENCIES */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>6. Official Competencies</span>
            </h2>
            <Link href="/trainee/competencies" className="text-xs text-blue-900 hover:underline">
              Competency details
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Weather Forecasting Fundamentals', score: 45, benchmark: 75 },
              { name: 'Radar Meteorology & Doppler Interpretation', score: 55, benchmark: 75 },
              { name: 'Satellite Data Analysis (INSAT-3D)', score: 70, benchmark: 70 },
              { name: 'Python for Meteorological Data', score: 60, benchmark: 80 },
            ].map((c, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-800">{c.name}</span>
                  <span className="font-mono font-bold text-blue-900">{c.score}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-900 h-1.5 rounded-full" style={{ width: `${c.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. CERTIFICATES */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif">
              <Award className="w-4 h-4 text-purple-700" />
              <span>7. Certified Credentials</span>
            </h2>
            <Link href="/trainee/certificates" className="text-xs text-blue-900 hover:underline">
              Certificate Vault
            </Link>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 font-serif">Satellite Meteorology & Atmospheric Dynamics</h4>
                <p className="text-[11px] text-slate-500 font-mono">Issued by IMD HQ • Grade: 88%</p>
              </div>
            </div>
            <Link href="/trainee/certificates" className="btn-secondary text-xs py-1.5 px-3">
              View
            </Link>
          </div>
        </div>

        {/* 8. LEARNING STATISTICS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
            <BarChart3 className="w-4 h-4 text-blue-900" />
            <span>8. Learning Statistics</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Courses Enrolled</span>
              <span className="text-xl font-bold font-mono text-slate-900">3 Courses</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Completion Rate</span>
              <span className="text-xl font-bold font-mono text-emerald-700">67%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Exam Score</span>
              <span className="text-xl font-bold font-mono text-blue-900">81%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Hours Learned</span>
              <span className="text-xl font-bold font-mono text-purple-700">42 hrs</span>
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 text-xs font-semibold"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
