'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  BookOpen,
  GraduationCap,
  FileCheck2,
  Award,
  Sparkles,
  MessageSquare,
  Megaphone,
  PlusCircle,
  Library,
  Users,
  BarChart3,
  Sliders,
  Shield,
  Layers,
  Compass,
  Calendar,
  Bell,
  GitFork,
  Brain,
  Grid3X3,
  Target,
  FileBadge,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface SidebarProps {
  role: UserRole;
  userName?: string;
  designation?: string;
}

export default function Sidebar({ role, userName, designation }: SidebarProps) {
  const pathname = usePathname();

  // Exactly 13 items as specified in user prompt
  const traineeLinks = [
    { name: 'Dashboard', href: '/trainee/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', href: '/trainee/profile', icon: User },
    { name: 'My Learning', href: '/trainee/courses', icon: GraduationCap },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Assessments', href: '/trainee/assessments', icon: FileCheck2 },
    { name: 'Competencies', href: '/trainee/competencies', icon: Compass },
    { name: 'Learning Path', href: '/trainee/learning-path', icon: GitFork },
    { name: 'Certificates', href: '/trainee/certificates', icon: Award },
    { name: 'Competency Passport', href: '/trainee/passport', icon: FileBadge },
    { name: 'Calendar', href: '/trainee/calendar', icon: Calendar },
    { name: 'Capacity AI', href: '/trainee/ai', icon: Brain },
    { name: 'Notifications', href: '/trainee/notifications', icon: Bell },
    { name: 'Feedback', href: '/trainee/feedback', icon: MessageSquare },
  ];

  // Exactly 11 items as specified in user prompt
  const trainerLinks = [
    { name: 'Dashboard', href: '/trainer/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', href: '/trainer/profile', icon: User },
    { name: 'My Courses', href: '/trainer/courses', icon: BookOpen },
    { name: 'Create Course', href: '/trainer/courses/create', icon: PlusCircle },
    { name: 'Trainer Library', href: '/trainer/library', icon: Library },
    { name: 'Assessments', href: '/trainer/assessments', icon: FileCheck2 },
    { name: 'Trainees', href: '/trainer/trainees', icon: Users },
    { name: 'Competencies', href: '/trainer/competencies', icon: Compass },
    { name: 'Trainer Matching', href: '/trainer/trainer-matching', icon: Target },
    { name: 'Calendar', href: '/trainer/calendar', icon: Calendar },
    { name: 'Feedback', href: '/trainer/feedback', icon: MessageSquare },
  ];

  // Exactly 14 items as specified in user prompt
  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Trainees', href: '/admin/trainees', icon: GraduationCap },
    { name: 'Trainers', href: '/admin/trainers', icon: Award },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Assessments', href: '/admin/assessments', icon: FileCheck2 },
    { name: 'Competencies', href: '/admin/competencies', icon: Compass },
    { name: 'Skill Heatmap', href: '/admin/heatmap', icon: Grid3X3 },
    { name: 'Trainer Matching', href: '/admin/trainer-matching', icon: Target },
    { name: 'Training Impact', href: '/admin/training-impact', icon: BarChart3 },
    { name: 'Certificates', href: '/admin/certificates', icon: Award },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Analytics', href: '/admin/analytics', icon: Layers },
    { name: 'Settings', href: '/admin/settings', icon: Sliders },
  ];

  const links =
    role === 'admin'
      ? adminLinks
      : role === 'trainer'
      ? trainerLinks
      : traineeLinks;

  const roleBadge =
    role === 'admin'
      ? 'bg-amber-100 text-amber-900 border-amber-300'
      : role === 'trainer'
      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
      : 'bg-blue-100 text-blue-900 border-blue-300';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-69px)] flex flex-col justify-between">
      <div className="p-4">
        {/* User Identity Banner */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${roleBadge}`}
            >
              {role} Portal
            </span>
            <span className="text-[10px] text-slate-400 font-mono">IMD HQ</span>
          </div>
          <div className="font-bold text-slate-800 text-sm truncate">{userName || 'User'}</div>
          <div className="text-[11px] text-slate-500 truncate">
            {designation || 'Meteorological Cadre'}
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Navigation Menu
          </p>
          {links.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/' &&
                item.href !== '/courses' &&
                pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-xs font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-amber-400' : 'text-slate-500'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Official Support Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Shield className="w-3.5 h-3.5 text-blue-900" />
            <span>Capacity Connect v2.6</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Ministry of Earth Sciences, Govt of India.
          </p>
        </div>
      </div>
    </aside>
  );
}
