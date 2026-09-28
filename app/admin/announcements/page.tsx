'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, PlusCircle, CheckCircle2, AlertCircle, Calendar, Send } from 'lucide-react';
import { IAnnouncement } from '@/lib/types';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'general' | 'course' | 'achievement' | 'urgent'>('general');
  const [targetRole, setTargetRole] = useState<'all' | 'trainee' | 'trainer'>('all');
  const [priority, setPriority] = useState<'normal' | 'high'>('normal');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (res.ok) setAnnouncements(data.announcements || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          type,
          targetRole,
          priority,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnnouncements([data.announcement, ...announcements]);
        setTitle('');
        setContent('');
        setSuccessMsg('Announcement broadcasted successfully to all portals.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to create announcement');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Official Circulars & Broadcast Announcements
        </h1>
        <p className="text-xs text-slate-500">
          Broadcast official notices, mandatory workshops, and achievement updates to Trainee and
          Trainer dashboards.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Creation Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Megaphone className="w-4 h-4 text-blue-900" />
          <span>Broadcast New Communication</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Announcement Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mandatory Pre-Monsoon Radar Interpretation Workshop 2026"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="general">General Circular</option>
                <option value="course">Course Notice</option>
                <option value="achievement">Institutional Achievement</option>
                <option value="urgent">Urgent Operational Advisory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="all">All Cadres (Trainee & Trainer)</option>
                <option value="trainee">Trainees Only</option>
                <option value="trainer">Faculty & Trainers Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
              >
                <option value="normal">Normal</option>
                <option value="high">HIGH PRIORITY</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Communication Content & Instructions
            </label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide exact administrative circular details, deadlines, and mandatory requirements..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Broadcasting...' : 'Publish Official Announcement'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Announcements */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Active Broadcast Circulars ({announcements.length})
        </h3>
        {announcements.map((ann) => (
          <div key={ann._id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900 text-sm">{ann.title}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(ann.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed my-2">{ann.content}</p>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-100">
              <span>Audience: {ann.targetRole.toUpperCase()}</span>
              <span>Category: {ann.type}</span>
              <span>Author: {ann.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
