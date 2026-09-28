'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { ITraineeProfile } from '@/lib/types';

export default function TraineeProfilePage() {
  const [profile, setProfile] = useState<ITraineeProfile | null>(null);
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
    return <div className="p-8 text-xs text-slate-500">Loading professional profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900">
            Professional Trainee Profile
          </h1>
          <p className="text-xs text-slate-500">
            Manage your official IMD cadre information, scientific education, operational
            experience, and skills.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-900" />
            <span>Official Identity & Station Assignment</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Regional Meteorological Centre / Division
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Cadre Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Certified Qualifications Count
              </label>
              <div className="px-3 py-2 text-xs rounded-lg bg-slate-100 font-mono font-bold text-slate-800">
                {profile?.completedCertificatesCount || 1} Issued Credentials
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Professional Bio & Operational Experience Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Education & Academic Qualifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <GraduationCap className="w-4 h-4 text-blue-900" />
            <span>Academic Background & Meteorological Education</span>
          </h2>

          <div className="space-y-3">
            {profile?.education?.map((edu, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.institution}</p>
                  <p className="text-[11px] text-blue-900 font-medium">
                    Specialization: {edu.qualification}
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold px-2 py-1 bg-white rounded border border-slate-200">
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Experience */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-blue-900" />
            <span>Professional & Field Experience</span>
          </h2>

          <div className="space-y-3">
            {profile?.experience?.map((exp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{exp.position}</h3>
                  <p className="text-slate-600">{exp.organization}</p>
                </div>
                <span className="font-mono text-xs font-semibold px-2 py-1 bg-white rounded border border-slate-200">
                  {exp.years} Years
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Scientific Interests */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-blue-900" />
            <span>Technical Skills & Scientific Research Interests</span>
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
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Meteorological Research Interests (Comma separated)
              </label>
              <input
                type="text"
                value={interestsStr}
                onChange={(e) => setInterestsStr(e.target.value)}
                placeholder="Monsoon Depressions, Severe Thunderstorm Nowcasting, INSAT Payloads"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
