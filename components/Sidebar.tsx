'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  BookOpen,
  GraduationCap,
  FileCheck2,
  Award,
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
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface SidebarProps {
  role: UserRole;
  userName?: string;
  designation?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'gold' | 'ai' | 'neutral';
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export default function Sidebar({ role, userName, designation }: SidebarProps) {
  const pathname = usePathname();

  // Categorized navigation groups to declutter the menu bar
  const traineeGroups: NavGroup[] = [
    {
      id: 'overview',
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/trainee/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', href: '/trainee/profile', icon: User },
      ],
    },
    {
      id: 'academics',
      title: 'Training & Courses',
      items: [
        { name: 'My Learning', href: '/trainee/courses', icon: GraduationCap },
        { name: 'Courses', href: '/courses', icon: BookOpen },
        { name: 'Learning Path', href: '/trainee/learning-path', icon: GitFork },
        { name: 'Assessments', href: '/trainee/assessments', icon: FileCheck2 },
      ],
    },
    {
      id: 'credentials',
      title: 'Credentials & Skills',
      items: [
        {
          name: 'Competency Passport',
          href: '/trainee/passport',
          icon: FileBadge,
          badge: 'Official',
          badgeType: 'gold',
        },
        { name: 'Competencies', href: '/trainee/competencies', icon: Compass },
        { name: 'Certificates', href: '/trainee/certificates', icon: Award },
      ],
    },
    {
      id: 'workspace',
      title: 'Workspace & Tools',
      items: [
        {
          name: 'MeghSetu AI',
          href: '/trainee/ai',
          icon: Brain,
          badge: 'AI',
          badgeType: 'ai',
        },
        { name: 'Calendar', href: '/trainee/calendar', icon: Calendar },
        { name: 'Notifications', href: '/trainee/notifications', icon: Bell },
        { name: 'Feedback', href: '/trainee/feedback', icon: MessageSquare },
      ],
    },
  ];

  const trainerGroups: NavGroup[] = [
    {
      id: 'overview',
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/trainer/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', href: '/trainer/profile', icon: User },
      ],
    },
    {
      id: 'studio',
      title: 'Course Studio',
      items: [
        { name: 'My Courses', href: '/trainer/courses', icon: BookOpen },
        { name: 'Create Course', href: '/trainer/courses/create', icon: PlusCircle },
        { name: 'Trainer Library', href: '/trainer/library', icon: Library },
        { name: 'Assessments', href: '/trainer/assessments', icon: FileCheck2 },
      ],
    },
    {
      id: 'cadre',
      title: 'Cadre & Evaluation',
      items: [
        { name: 'Trainees', href: '/trainer/trainees', icon: Users },
        { name: 'Competencies', href: '/trainer/competencies', icon: Compass },
        { name: 'Trainer Matching', href: '/trainer/trainer-matching', icon: Target },
      ],
    },
    {
      id: 'tools',
      title: 'Faculty Tools',
      items: [
        { name: 'Calendar', href: '/trainer/calendar', icon: Calendar },
        { name: 'Feedback', href: '/trainer/feedback', icon: MessageSquare },
      ],
    },
  ];

  const adminGroups: NavGroup[] = [
    {
      id: 'executive',
      title: 'Executive Overview',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', href: '/admin/analytics', icon: Layers },
        { name: 'Training Impact', href: '/admin/training-impact', icon: BarChart3 },
      ],
    },
    {
      id: 'cadre',
      title: 'Cadre Management',
      items: [
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Trainees', href: '/admin/trainees', icon: GraduationCap },
        { name: 'Trainers', href: '/admin/trainers', icon: Award },
        { name: 'Trainer Matching', href: '/admin/trainer-matching', icon: Target },
      ],
    },
    {
      id: 'academics',
      title: 'Curriculum & Skills',
      items: [
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Assessments', href: '/admin/assessments', icon: FileCheck2 },
        { name: 'Competencies', href: '/admin/competencies', icon: Compass },
        { name: 'Skill Heatmap', href: '/admin/heatmap', icon: Grid3X3 },
        { name: 'Certificates', href: '/admin/certificates', icon: Award },
      ],
    },
    {
      id: 'governance',
      title: 'Institutional Ops',
      items: [
        { name: 'Calendar', href: '/admin/calendar', icon: Calendar },
        { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
        { name: 'Settings', href: '/admin/settings', icon: Sliders },
      ],
    },
  ];

  const groups =
    role === 'admin'
      ? adminGroups
      : role === 'trainer'
      ? trainerGroups
      : traineeGroups;

  // Flattened links for lookup
  const allLinks = groups.flatMap((g) => g.items);

  const roleBadge =
    role === 'admin'
      ? 'bg-rose-50 text-rose-800 border-rose-200'
      : role === 'trainer'
      ? 'bg-purple-50 text-purple-800 border-purple-200'
      : 'bg-blue-50 text-blue-800 border-blue-200';

  const [mobileOpen, setMobileOpen] = useState(false);

  // Allow collapsing groups; all default open
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const isLinkActive = (href: string) => {
    return (
      pathname === href ||
      (href !== '/' && href !== '/courses' && pathname?.startsWith(href))
    );
  };

  const activeItem = allLinks.find((item) => isLinkActive(item.href)) || allLinks[0];

  const renderBadge = (badge?: string, type?: 'gold' | 'ai' | 'neutral', isActive?: boolean) => {
    if (!badge) return null;

    if (type === 'gold') {
      return (
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide transition-colors ${
            isActive
              ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {badge}
        </span>
      );
    }

    if (type === 'ai') {
      return (
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide transition-colors ${
            isActive
              ? 'bg-indigo-400/25 text-indigo-200 border border-indigo-300/40'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}
        >
          {badge}
        </span>
      );
    }

    return (
      <span
        className={`text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide transition-colors ${
          isActive
            ? 'bg-white/20 text-white'
            : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}
      >
        {badge}
      </span>
    );
  };

  return (
    <>
      {/* Mobile Portal Navigation Bar (Collapsible) */}
      <div className="md:hidden w-full bg-white border-b border-slate-200 sticky top-[65px] z-30 shadow-2xs">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${roleBadge}`}
            >
              {role}
            </span>
            <span className="text-[14px] font-semibold text-slate-800 flex items-center gap-1.5 truncate max-w-[200px]">
              {React.createElement(activeItem.icon, {
                className: 'w-4 h-4 text-blue-900 shrink-0',
              })}
              <span>{activeItem.name}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[14px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition"
          >
            <span>{mobileOpen ? 'Close Menu' : 'Portal Menu'}</span>
            <span className="text-[12px] text-slate-500 font-normal">({allLinks.length})</span>
          </button>
        </div>

        {mobileOpen && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-3 max-h-[65vh] overflow-y-auto animate-in fade-in duration-150">
            {groups.map((group) => (
              <div key={group.id} className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                  {group.title}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = isLinkActive(item.href);

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-2.5 py-2 text-[14px] rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-950 text-white font-semibold shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-amber-400' : 'text-slate-500'
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {renderBadge(item.badge, item.badgeType, isActive)}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Institutional Sidebar with Decluttered Visual Hierarchy */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-69px)] flex-col justify-between sticky top-[69px] self-start max-h-[calc(100vh-69px)] overflow-y-auto">
        <div className="p-3.5">
          {/* User Identity Banner (Streamlined) */}
          <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/90 mb-3 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${roleBadge}`}
              >
                {role} Portal
              </span>
              <span className="text-[11px] text-slate-400 font-mono">IMD Cadre</span>
            </div>
            <div className="font-bold text-slate-900 text-[15px] truncate">
              {userName || 'User'}
            </div>
            <div className="text-[13px] text-slate-500 truncate mt-0.5 font-normal">
              {designation || 'Meteorological Cadre'}
            </div>
          </div>

          {/* Grouped & Decluttered Navigation */}
          <nav className="space-y-3.5" aria-label="Portal Navigation">
            {groups.map((group, groupIndex) => {
              const isCollapsed = collapsedGroups[group.id];
              const hasActiveChild = group.items.some((it) => isLinkActive(it.href));

              return (
                <div
                  key={group.id}
                  className={groupIndex > 0 ? 'pt-2 border-t border-slate-100' : ''}
                >
                  {/* Group Header with Collapse Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{group.title}</span>
                      {hasActiveChild && isCollapsed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                      )}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                        isCollapsed ? '-rotate-90' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {/* Group Navigation Links */}
                  {!isCollapsed && (
                    <div className="space-y-0.5 mt-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = isLinkActive(item.href);

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center justify-between px-2.5 py-1.5 text-[14px] rounded-lg transition-all relative ${
                              isActive
                                ? 'bg-blue-950 text-white font-semibold shadow-xs before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-amber-400 before:rounded-r'
                                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Icon
                                className={`w-4 h-4 shrink-0 transition-colors ${
                                  isActive
                                    ? 'text-amber-400'
                                    : 'text-slate-400 group-hover:text-slate-700'
                                }`}
                              />
                              <span className="truncate">{item.name}</span>
                            </div>

                            {renderBadge(item.badge, item.badgeType, isActive)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Official Support Footer */}
        <div className="p-3.5 border-t border-slate-200/90 bg-slate-50/70 mt-auto">
          <div className="flex items-center gap-2 text-slate-600">
            <Shield className="w-3.5 h-3.5 text-blue-900 shrink-0" />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-slate-800 truncate">
                MeghSetu
              </div>
              <div className="text-[12px] text-slate-400 truncate font-normal">
                Ministry of Earth Sciences, MoES
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

