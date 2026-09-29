'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  Award,
  AlertCircle,
  FileCheck2,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Users,
  Building,
  Flag,
  CalendarDays,
  List,
  Grid3X3,
  Columns,
  X,
  Edit2,
  Trash2,
  Copy,
  Info,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ITrainingEvent, CalendarEventType, EventPriority, ICalendarConflict } from '@/lib/types';

interface CentralizedCalendarProps {
  initialEvents: ITrainingEvent[];
  userRole: 'trainee' | 'trainer' | 'admin';
  currentUserId?: string;
  currentUserName?: string;
}

// Color coding mapping (subtle indicators, badges, borders)
export const EVENT_TYPE_CONFIG: Record<
  string,
  {
    label: string;
    badgeBg: string;
    badgeText: string;
    borderAccent: string;
    dotColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  TRAINING: {
    label: 'Training Session',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-900 border-blue-200',
    borderAccent: 'border-l-blue-600',
    dotColor: 'bg-blue-600',
    icon: Video,
  },
  live_session: {
    label: 'Live Training',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-900 border-blue-200',
    borderAccent: 'border-l-blue-600',
    dotColor: 'bg-blue-600',
    icon: Video,
  },
  COURSE: {
    label: 'Course Milestone',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-900 border-indigo-200',
    borderAccent: 'border-l-indigo-600',
    dotColor: 'bg-indigo-600',
    icon: BookOpen,
  },
  course_start: {
    label: 'Course Start',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-900 border-indigo-200',
    borderAccent: 'border-l-indigo-600',
    dotColor: 'bg-indigo-600',
    icon: BookOpen,
  },
  ASSESSMENT: {
    label: 'Assessment',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-900 border-purple-200',
    borderAccent: 'border-l-purple-600',
    dotColor: 'bg-purple-600',
    icon: FileCheck2,
  },
  EXAM: {
    label: 'Certification Exam',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-900 border-rose-200',
    borderAccent: 'border-l-rose-600',
    dotColor: 'bg-rose-600',
    icon: Award,
  },
  ASSIGNMENT: {
    label: 'Assignment Submission',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-900 border-amber-200',
    borderAccent: 'border-l-amber-500',
    dotColor: 'bg-amber-500',
    icon: Clock,
  },
  DEADLINE: {
    label: 'Module Deadline',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-900 border-orange-200',
    borderAccent: 'border-l-orange-500',
    dotColor: 'bg-orange-500',
    icon: AlertCircle,
  },
  assessment_deadline: {
    label: 'Deadline',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-900 border-orange-200',
    borderAccent: 'border-l-orange-500',
    dotColor: 'bg-orange-500',
    icon: AlertCircle,
  },
  MEETING: {
    label: 'Meeting / Briefing',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-900 border-emerald-200',
    borderAccent: 'border-l-emerald-600',
    dotColor: 'bg-emerald-600',
    icon: Users,
  },
  WORKSHOP: {
    label: 'Workshop',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-900 border-teal-200',
    borderAccent: 'border-l-teal-600',
    dotColor: 'bg-teal-600',
    icon: Building,
  },
  CERTIFICATION: {
    label: 'Certification',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-900 border-cyan-200',
    borderAccent: 'border-l-cyan-600',
    dotColor: 'bg-cyan-600',
    icon: Award,
  },
  COMPETENCY: {
    label: 'Competency Evaluation',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-900 border-violet-200',
    borderAccent: 'border-l-violet-600',
    dotColor: 'bg-violet-600',
    icon: CheckCircle2,
  },
  HOLIDAY: {
    label: 'Official Holiday',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800 border-slate-300',
    borderAccent: 'border-l-slate-400',
    dotColor: 'bg-slate-400',
    icon: Flag,
  },
  ADMINISTRATIVE: {
    label: 'Administrative Event',
    badgeBg: 'bg-slate-50',
    badgeText: 'text-slate-900 border-slate-300',
    borderAccent: 'border-l-slate-600',
    dotColor: 'bg-slate-600',
    icon: Building,
  },
  OTHER: {
    label: 'Other Event',
    badgeBg: 'bg-slate-50',
    badgeText: 'text-slate-700 border-slate-200',
    borderAccent: 'border-l-slate-400',
    dotColor: 'bg-slate-400',
    icon: CalendarIcon,
  },
};

export default function CentralizedCalendar({
  initialEvents,
  userRole,
  currentUserId = 'usr_trainee_001',
  currentUserName = 'Pooja Iyer',
}: CentralizedCalendarProps) {
  const [events, setEvents] = useState<ITrainingEvent[]>(initialEvents);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');

  // Calendar anchor date
  // Using October 2026 as standard anchor matching platform demo
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 1)); // Oct 2026

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [showOnlyMySchedule, setShowOnlyMySchedule] = useState(false);

  // Selected event for Detail Modal / Slide-over
  const [selectedEvent, setSelectedEvent] = useState<ITrainingEvent | null>(null);

  // Modal for Create / Edit Event
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<ITrainingEvent> | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [conflictWarning, setConflictWarning] = useState<ICalendarConflict[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Personal reminder modal or prompt
  const [reminderModalEvent, setReminderModalEvent] = useState<ITrainingEvent | null>(null);
  const [reminderPreset, setReminderPreset] = useState<'15m' | '30m' | '1h' | '1d' | '3d'>('1d');
  const [reminderNote, setReminderNote] = useState('');

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Distinct courses for filter dropdown
  const availableCourses = useMemo(() => {
    const courses = new Set<string>();
    events.forEach((e) => {
      if (e.courseTitle) courses.add(e.courseTitle);
    });
    return Array.from(courses);
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = e.title?.toLowerCase().includes(q);
        const matchDesc = e.description?.toLowerCase().includes(q);
        const matchCourse = e.courseTitle?.toLowerCase().includes(q);
        const matchOrganizer = e.organizer?.name?.toLowerCase().includes(q);
        const matchLoc = (e.location || e.locationOrLink)?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCourse && !matchOrganizer && !matchLoc) {
          return false;
        }
      }

      // Event Type
      if (selectedType !== 'ALL') {
        const typeNormalized = (e.eventType || e.type || '').toUpperCase();
        if (typeNormalized !== selectedType.toUpperCase()) return false;
      }

      // Priority
      if (selectedPriority !== 'ALL') {
        if ((e.priority || 'medium') !== selectedPriority) return false;
      }

      // Course
      if (selectedCourse !== 'ALL') {
        if (e.courseTitle !== selectedCourse) return false;
      }

      // My Schedule only
      if (showOnlyMySchedule) {
        const isOrganizer = e.organizer?.id === currentUserId || e.userId === currentUserId;
        const isParticipant = e.participants?.some((p) => p.id === currentUserId);
        if (!isOrganizer && !isParticipant) return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedType, selectedPriority, selectedCourse, showOnlyMySchedule, currentUserId]);

  // Compute Deadlines for Sidebar Panel
  // "TODAY" is simulated as 2026-09-29 / 2026-10-01
  const todayStr = '2026-09-29';
  const deadlines = useMemo(() => {
    const now = new Date(todayStr).getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    const overdue: ITrainingEvent[] = [];
    const todayList: ITrainingEvent[] = [];
    const tomorrowList: ITrainingEvent[] = [];
    const next7Days: ITrainingEvent[] = [];
    const next30Days: ITrainingEvent[] = [];

    events.forEach((evt) => {
      const evtDate = new Date(evt.date).getTime();
      const diffDays = Math.round((evtDate - now) / oneDay);

      if (evt.status === 'overdue' || diffDays < 0) {
        if (evt.status !== 'completed' && !evt.completedUserIds?.includes(currentUserId)) {
          overdue.push(evt);
        }
      } else if (diffDays === 0) {
        todayList.push(evt);
      } else if (diffDays === 1) {
        tomorrowList.push(evt);
      } else if (diffDays > 1 && diffDays <= 7) {
        next7Days.push(evt);
      } else if (diffDays > 7 && diffDays <= 30) {
        next30Days.push(evt);
      }
    });

    return { overdue, todayList, tomorrowList, next7Days, next30Days };
  }, [events, currentUserId]);

  // Navigation handlers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else if (viewMode === 'day') {
      d.setDate(d.getDate() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else if (viewMode === 'day') {
      d.setDate(d.getDate() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 1));
  };

  // Check completion
  const isCompletedByUser = (evt: ITrainingEvent) => {
    return evt.completedUserIds?.includes(currentUserId) || evt.status === 'completed';
  };

  const handleToggleComplete = async (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch('/api/calendar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_complete',
          eventId,
          userId: currentUserId,
        }),
      });
      const data = await res.json();
      if (data.success && data.event) {
        setEvents((prev) => prev.map((ev) => (ev._id === eventId ? data.event : ev)));
        if (selectedEvent && selectedEvent._id === eventId) {
          setSelectedEvent(data.event);
        }
        showToast(data.completed ? 'Event marked as completed' : 'Event marked as pending');
      }
    } catch {
      showToast('Failed to update event status');
    }
  };

  // Add personal reminder
  const handleSaveReminder = async () => {
    if (!reminderModalEvent) return;
    try {
      const res = await fetch('/api/calendar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_reminder',
          eventId: reminderModalEvent._id,
          userId: currentUserId,
          remindBefore: reminderPreset,
          note: reminderNote,
        }),
      });
      const data = await res.json();
      if (data.success && data.event) {
        setEvents((prev) => prev.map((ev) => (ev._id === reminderModalEvent._id ? data.event : ev)));
        if (selectedEvent && selectedEvent._id === reminderModalEvent._id) {
          setSelectedEvent(data.event);
        }
        showToast(`Personal reminder set: ${reminderPreset} before event`);
        setReminderModalEvent(null);
      }
    } catch {
      showToast('Failed to set reminder');
    }
  };

  // Create / Edit submission
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.title || !editingEvent?.date) {
      setFormErrors(['Title and Date are required']);
      return;
    }

    setIsSubmitting(true);
    setFormErrors([]);
    try {
      const isEdit = Boolean(editingEvent._id);
      const url = '/api/calendar';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        ...editingEvent,
        type: editingEvent.eventType || editingEvent.type || 'TRAINING',
        eventType: editingEvent.eventType || editingEvent.type || 'TRAINING',
        location: editingEvent.location || 'IMD Regional Center / Online Webex',
        locationOrLink: editingEvent.location || editingEvent.locationOrLink,
        organizer: editingEvent.organizer || {
          id: currentUserId,
          name: currentUserName,
          role: userRole === 'trainer' ? 'Chief Faculty' : 'Administration',
        },
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        if (data.conflicts && data.conflicts.length > 0) {
          setConflictWarning(data.conflicts);
        } else {
          setConflictWarning([]);
        }

        if (isEdit) {
          setEvents((prev) => prev.map((ev) => (ev._id === data.event._id ? data.event : ev)));
          showToast('Calendar event updated successfully');
        } else {
          setEvents((prev) => [data.event, ...prev]);
          showToast('Event created and synchronized across platforms!');
        }
        setIsFormOpen(false);
        setEditingEvent(null);
      } else {
        setFormErrors([data.error || 'Failed to save event']);
      }
    } catch (err: any) {
      setFormErrors([err.message || 'Error occurred while saving']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to cancel and remove this centralized event?')) return;
    try {
      const res = await fetch(`/api/calendar?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setEvents((prev) => prev.filter((e) => e._id !== id));
        setSelectedEvent(null);
        showToast('Event cancelled and removed');
      }
    } catch {
      showToast('Failed to delete event');
    }
  };

  // Helper formatting
  const getHelperConfig = (type: string = 'OTHER') => {
    return EVENT_TYPE_CONFIG[type] || EVENT_TYPE_CONFIG[type.toUpperCase()] || EVENT_TYPE_CONFIG.OTHER;
  };

  // Days in month calculation for Month View
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Preceding month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const mm = String(month).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      days.push({
        dateStr: `${year}-${mm}-${dd}`,
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(i).padStart(2, '0');
      days.push({
        dateStr: `${year}-${mm}-${dd}`,
        dayNum: i,
        isCurrentMonth: true,
      });
    }

    // Trailing next month days to fill 35 or 42 grid cells
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextMonthYear = month === 11 ? year + 1 : year;
      const nextMonth = month === 11 ? 1 : month + 2;
      const mm = String(nextMonth).padStart(2, '0');
      const dd = String(i).padStart(2, '0');
      days.push({
        dateStr: `${nextMonthYear}-${mm}-${dd}`,
        dayNum: i,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  // Week View Days
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const dayOfWeek = curr.getDay();
    const startOfWeek = new Date(curr);
    startOfWeek.setDate(curr.getDate() - dayOfWeek);

    const days: { dateStr: string; dayName: string; dayNum: number }[] = [];
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${year}-${month}-${day}`,
        dayName: names[i],
        dayNum: d.getDate(),
      });
    }
    return days;
  }, [currentDate]);

  const canManageEvents = userRole === 'admin' || userRole === 'trainer';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / System Meta */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-blue-900/10 text-blue-900 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                  MeghSetu Centralized Calendar & Schedules
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                  {userRole === 'admin' ? 'Global Command' : userRole === 'trainer' ? 'Faculty Roster' : 'Trainee Cadre'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Single source of truth: synchronized live lectures, assessment windows, deadlines, and IMD/MoES events.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls based on Role */}
        <div className="flex flex-wrap items-center gap-2">
          {canManageEvents && (
            <button
              onClick={() => {
                setEditingEvent({
                  date: '2026-10-05',
                  time: '10:00 AM – 12:00 PM IST',
                  duration: '2 Hours',
                  eventType: userRole === 'trainer' ? 'TRAINING' : 'COURSE',
                  priority: 'medium',
                  targetRoles: ['trainee', 'trainer', 'admin'],
                  reminderSettings: { enabled: true, preset: '1d' },
                });
                setIsFormOpen(true);
              }}
              className="btn-primary py-2 px-3.5 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Event</span>
            </button>
          )}

          <button
            onClick={() => setShowOnlyMySchedule(!showOnlyMySchedule)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
              showOnlyMySchedule
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showOnlyMySchedule ? 'Showing My Events' : 'My Schedule Filter'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Deadlines & Conflict Panel, Right Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT COLUMN: UPCOMING DEADLINES & CONFLICT MONITORS */}
        <div className="lg:col-span-1 space-y-5">
          {/* Upcoming Deadlines Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Upcoming Deadlines
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-900">
                {deadlines.todayList.length + deadlines.tomorrowList.length + deadlines.overdue.length} Active
              </span>
            </div>

            <div className="p-3.5 space-y-4 max-h-[580px] overflow-y-auto">
              {/* Overdue Section */}
              {deadlines.overdue.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-rose-700 tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Overdue
                    </span>
                    <span className="text-[10px] font-mono text-rose-600 font-bold">
                      {deadlines.overdue.length} Item
                    </span>
                  </div>
                  {deadlines.overdue.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedEvent(item)}
                      className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 text-xs cursor-pointer hover:bg-rose-100/70 transition space-y-1"
                    >
                      <div className="font-bold text-rose-900 line-clamp-1">{item.title}</div>
                      <div className="flex items-center justify-between text-[11px] text-rose-800">
                        <span>{item.courseTitle || 'System Deadline'}</span>
                        <span className="font-semibold text-rose-900">Past Due</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Today */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                  Today
                </span>
                {deadlines.todayList.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No deadlines scheduled today</p>
                ) : (
                  deadlines.todayList.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedEvent(item)}
                      className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs cursor-pointer hover:bg-amber-100/60 transition space-y-1 border-l-4 border-l-amber-500"
                    >
                      <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>{item.time || '5:00 PM'}</span>
                        <span className="font-semibold text-amber-900">Due Today</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Tomorrow */}
              {deadlines.tomorrowList.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                    Tomorrow
                  </span>
                  {deadlines.tomorrowList.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedEvent(item)}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs cursor-pointer hover:bg-slate-100 transition space-y-1 border-l-4 border-l-blue-600"
                    >
                      <div className="font-semibold text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{item.time || 'Morning'}</span>
                        <span className="font-medium text-blue-900">In 24 Hours</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Next 7 Days */}
              {deadlines.next7Days.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                    Next 7 Days
                  </span>
                  {deadlines.next7Days.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedEvent(item)}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:border-slate-300 transition space-y-1"
                    >
                      <div className="font-semibold text-slate-800 line-clamp-1">{item.title}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{item.date}</span>
                        <span>{item.time?.split('–')[0] || ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Conflict Status Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-blue-900" />
                Conflict Detection
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Automatic overlap checks protect trainees against conflicting examination slots and prevent double-booking faculty lecture halls.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CALENDAR BOARD & SEARCH CONTROLS */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar: Search, Filters, View Modes */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Month Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-base font-bold text-slate-900 min-w-[170px] text-center font-serif">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToday}
                  className="ml-2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Today
                </button>
              </div>

              {/* View Switcher: Month, Week, Day, Agenda */}
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 self-start md:self-auto">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                    viewMode === 'month'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>Month</span>
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                    viewMode === 'week'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Week</span>
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                    viewMode === 'day'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Day</span>
                </button>
                <button
                  onClick={() => setViewMode('agenda')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                    viewMode === 'agenda'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Agenda</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search events, courses, trainers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>

              {/* Event Type Filter */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  <option value="ALL">All Event Types</option>
                  <option value="TRAINING">Training / Live Sessions</option>
                  <option value="ASSESSMENT">Assessments</option>
                  <option value="DEADLINE">Deadlines</option>
                  <option value="EXAM">Certification Exams</option>
                  <option value="ASSIGNMENT">Assignments</option>
                  <option value="WORKSHOP">Workshops</option>
                  <option value="MEETING">Meetings</option>
                  <option value="COMPETENCY">Competency Evaluations</option>
                  <option value="HOLIDAY">Holidays</option>
                  <option value="ADMINISTRATIVE">Administrative</option>
                </select>
              </div>

              {/* Course Filter */}
              <div>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  <option value="ALL">All Associated Courses</option>
                  {availableCourses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* VIEW RENDERERS */}

          {/* 1. MONTH VIEW */}
          {viewMode === 'month' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-[11px] font-bold text-slate-600 py-2">
                <span>SUN</span>
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
                {monthDays.map((cell, idx) => {
                  const dayEvents = filteredEvents.filter((ev) => ev.date === cell.dateStr);
                  const isCurrentDay = cell.dateStr === '2026-10-01' || cell.dateStr === '2026-09-29';

                  return (
                    <div
                      key={idx}
                      className={`min-h-[105px] p-1.5 flex flex-col justify-between transition hover:bg-slate-50/70 ${
                        cell.isCurrentMonth ? 'bg-white' : 'bg-slate-50/40 text-slate-400'
                      }`}
                    >
                      {/* Day number header */}
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                            isCurrentDay
                              ? 'bg-blue-900 text-white shadow-2xs font-extrabold'
                              : cell.isCurrentMonth
                              ? 'text-slate-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {cell.dayNum}
                        </span>
                        {dayEvents.length > 2 && (
                          <span className="text-[10px] text-slate-400 font-mono font-bold">
                            +{dayEvents.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Event chips */}
                      <div className="space-y-1 flex-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev) => {
                          const cfg = getHelperConfig(ev.eventType || ev.type);
                          const completed = isCompletedByUser(ev);

                          return (
                            <button
                              key={ev._id}
                              onClick={() => setSelectedEvent(ev)}
                              className={`w-full text-left p-1 rounded-md text-[11px] border border-l-3 leading-tight truncate block transition shadow-2xs ${
                                completed
                                  ? 'bg-slate-100 text-slate-500 line-through border-slate-300 border-l-slate-400'
                                  : `${cfg.badgeBg} ${cfg.badgeText} ${cfg.borderAccent}`
                              }`}
                            >
                              <div className="font-semibold truncate">{ev.title}</div>
                              {ev.time && (
                                <div className="text-[9px] opacity-75 truncate">{ev.time.split('–')[0]}</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. WEEK VIEW */}
          {viewMode === 'week' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2.5">
                {weekDays.map((w, i) => (
                  <div key={i} className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">{w.dayName}</span>
                    <div className="text-sm font-extrabold text-slate-900">{w.dayNum}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[460px]">
                {weekDays.map((w, i) => {
                  const dayEvents = filteredEvents.filter((ev) => ev.date === w.dateStr);

                  return (
                    <div key={i} className="p-2 space-y-2 bg-white">
                      {dayEvents.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-[10px] text-slate-300 italic">
                          No events
                        </div>
                      ) : (
                        dayEvents.map((ev) => {
                          const cfg = getHelperConfig(ev.eventType || ev.type);
                          return (
                            <div
                              key={ev._id}
                              onClick={() => setSelectedEvent(ev)}
                              className={`p-2 rounded-lg border border-l-3 text-xs cursor-pointer shadow-2xs space-y-1 hover:brightness-95 transition ${cfg.badgeBg} ${cfg.badgeText} ${cfg.borderAccent}`}
                            >
                              <span className="font-bold line-clamp-2 leading-snug">{ev.title}</span>
                              <div className="text-[10px] text-slate-600 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3 shrink-0" />
                                <span className="truncate">{ev.time || 'All Day'}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. DAY VIEW */}
          {viewMode === 'day' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    Schedule for {currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <p className="text-xs text-slate-500">Official timeline for today’s operations.</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200">
                  {filteredEvents.filter((ev) => ev.date === '2026-10-01').length} Events
                </span>
              </div>

              <div className="space-y-3">
                {filteredEvents
                  .filter((ev) => ev.date === '2026-10-01' || ev.date === '2026-09-30')
                  .map((ev) => {
                    const cfg = getHelperConfig(ev.eventType || ev.type);
                    return (
                      <div
                        key={ev._id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`p-4 rounded-xl border border-l-4 shadow-xs cursor-pointer hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${cfg.borderAccent}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cfg.badgeBg} ${cfg.badgeText}`}>
                              {cfg.label}
                            </span>
                            <span className="text-xs font-mono text-slate-500 font-semibold">{ev.time}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-1">{ev.description}</p>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 shrink-0 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-blue-900" />
                          <span>{ev.location || ev.locationOrLink}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* 4. AGENDA / LIST VIEW */}
          {viewMode === 'agenda' && (
            <div className="space-y-3">
              {filteredEvents.map((ev) => {
                const cfg = getHelperConfig(ev.eventType || ev.type);
                const Icon = cfg.icon;
                const completed = isCompletedByUser(ev);

                return (
                  <div
                    key={ev._id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${cfg.borderAccent}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Date block */}
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 text-center flex flex-col justify-center shrink-0">
                        <span className="text-[10px] uppercase font-bold text-blue-900">
                          {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-lg font-extrabold text-slate-900 leading-tight">
                          {new Date(ev.date).getDate()}
                        </span>
                      </div>

                      {/* Main text */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${cfg.badgeBg} ${cfg.badgeText}`}>
                            <Icon className="w-3 h-3" />
                            <span>{cfg.label}</span>
                          </span>
                          <span className="text-xs font-mono text-slate-500 font-semibold">{ev.time}</span>
                          {ev.priority === 'urgent' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                              URGENT
                            </span>
                          )}
                        </div>

                        <h3 className={`text-sm font-bold ${completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {ev.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">{ev.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                          {ev.courseTitle && (
                            <span className="font-medium text-slate-700">Course: {ev.courseTitle}</span>
                          )}
                          {(ev.location || ev.locationOrLink) && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-blue-900" />
                              {ev.location || ev.locationOrLink}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {userRole === 'trainee' && (
                        <button
                          onClick={(e) => handleToggleComplete(ev._id, e)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition flex items-center gap-1 ${
                            completed
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{completed ? 'Completed' : 'Mark Done'}</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReminderModalEvent(ev);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                        title="Add personal reminder"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>

                      {ev.courseId && (
                        <Link
                          href={`/courses/${ev.courseId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="btn-secondary py-1.5 px-3 text-xs font-semibold flex items-center gap-1 text-blue-900 hover:text-blue-950"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* EVENT DETAIL SLIDE-OVER / MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      getHelperConfig(selectedEvent.eventType || selectedEvent.type).badgeBg
                    } ${getHelperConfig(selectedEvent.eventType || selectedEvent.type).badgeText}`}
                  >
                    {getHelperConfig(selectedEvent.eventType || selectedEvent.type).label}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      selectedEvent.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedEvent.priority === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedEvent.priority || 'medium'} priority
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              {/* Timing Card */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Date</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">{selectedEvent.date}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Time Window</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">{selectedEvent.time || 'Full Working Hours'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Duration</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{selectedEvent.duration || '2 Hours'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Status</span>
                  <span className="font-bold text-emerald-800 capitalize text-xs mt-0.5 block">
                    {selectedEvent.status || 'Scheduled'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">Description</span>
                <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  {selectedEvent.description || 'No description provided.'}
                </p>
              </div>

              {/* Organizer & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Organizer</span>
                  <p className="font-bold text-slate-900">{selectedEvent.organizer?.name || 'IMD Directorate'}</p>
                  <p className="text-[10px] text-slate-500">{selectedEvent.organizer?.role || 'Academic Authority'}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Location / Mode</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-900" />
                    <span>{selectedEvent.location || selectedEvent.locationOrLink}</span>
                  </p>
                </div>
              </div>

              {/* Related Course & Modules */}
              {selectedEvent.courseTitle && (
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-blue-900 block font-mono">Related Curriculum</span>
                  <p className="font-bold text-slate-900">{selectedEvent.courseTitle}</p>
                  {selectedEvent.moduleTitle && (
                    <p className="text-xs text-slate-600">{selectedEvent.moduleTitle}</p>
                  )}
                </div>
              )}

              {/* Personal Reminders Active */}
              {selectedEvent.personalReminders && selectedEvent.personalReminders.length > 0 && (
                <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-900 flex items-center gap-1">
                    <Bell className="w-3 h-3 text-amber-700" /> Personal Reminders Set
                  </span>
                  <div className="text-[11px] text-amber-800 space-y-0.5">
                    {selectedEvent.personalReminders.map((r, ri) => (
                      <div key={ri} className="flex justify-between">
                        <span>Notice: {r.remindBefore} prior</span>
                        {r.note && <span className="italic text-amber-700">"{r.note}"</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {userRole === 'trainee' && (
                  <button
                    onClick={() => handleToggleComplete(selectedEvent._id)}
                    className="btn-secondary py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5 text-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isCompletedByUser(selectedEvent) ? 'Mark Incomplete' : 'Mark Completed'}</span>
                  </button>
                )}
                <button
                  onClick={() => setReminderModalEvent(selectedEvent)}
                  className="btn-secondary py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5 text-slate-800"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span>Set Reminder</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {canManageEvents && (
                  <>
                    <button
                      onClick={() => {
                        setEditingEvent(selectedEvent);
                        setIsFormOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(selectedEvent._id)}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  </>
                )}

                {selectedEvent.courseId && (
                  <Link
                    href={`/courses/${selectedEvent.courseId}`}
                    className="btn-primary py-1.5 px-3 text-xs font-semibold flex items-center gap-1"
                  >
                    <span>View Course</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EVENT MODAL (ADMIN & TRAINER) */}
      {isFormOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <form onSubmit={handleSaveEvent}>
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    {editingEvent._id ? 'Edit Centralized Event' : 'Create New MeghSetu Event'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Schedules automatically synchronize across Trainee, Trainer, and Admin domains.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
                {formErrors.length > 0 && (
                  <div className="p-3 bg-rose-50 text-rose-900 rounded-lg border border-rose-200 space-y-0.5">
                    {formErrors.map((err, i) => (
                      <p key={i} className="font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {err}
                      </p>
                    ))}
                  </div>
                )}

                {/* Conflict Warnings */}
                {conflictWarning.length > 0 && (
                  <div className="p-3 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      SCHEDULING CONFLICT IDENTIFIED
                    </span>
                    {conflictWarning.map((c, i) => (
                      <p key={i} className="text-[11px] text-amber-800">
                        {c.reason} ({c.conflictingDate} • {c.conflictingTime})
                      </p>
                    ))}
                  </div>
                )}

                {/* Event Title */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    placeholder="e.g. Synoptic Meteorology Assessment"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-900"
                  />
                </div>

                {/* Event Type & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Event Type *</label>
                    <select
                      value={editingEvent.eventType || editingEvent.type || 'TRAINING'}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          type: e.target.value as CalendarEventType,
                          eventType: e.target.value as CalendarEventType,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      <option value="TRAINING">TRAINING (Live Session)</option>
                      <option value="ASSESSMENT">ASSESSMENT</option>
                      <option value="DEADLINE">DEADLINE</option>
                      <option value="EXAM">EXAM (Certification)</option>
                      <option value="ASSIGNMENT">ASSIGNMENT</option>
                      <option value="COURSE">COURSE MILESTONE</option>
                      <option value="COMPETENCY">COMPETENCY EVALUATION</option>
                      <option value="WORKSHOP">WORKSHOP</option>
                      <option value="MEETING">MEETING</option>
                      <option value="HOLIDAY">HOLIDAY</option>
                      <option value="ADMINISTRATIVE">ADMINISTRATIVE</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Priority</label>
                    <select
                      value={editingEvent.priority || 'medium'}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, priority: e.target.value as EventPriority })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Date * (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      required
                      value={editingEvent.date || '2026-10-05'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Time Slot</label>
                    <input
                      type="text"
                      value={editingEvent.time || '10:00 AM – 12:00 PM IST'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                      placeholder="e.g. 10:00 AM – 12:00 PM IST"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Location and Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Location / Online Link</label>
                    <input
                      type="text"
                      value={editingEvent.location || editingEvent.locationOrLink || ''}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          location: e.target.value,
                          locationOrLink: e.target.value,
                        })
                      }
                      placeholder="e.g. RMC Mumbai Hall 2 / Webex"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Duration</label>
                    <input
                      type="text"
                      value={editingEvent.duration || '2 Hours'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, duration: e.target.value })}
                      placeholder="e.g. 2 Hours, 45 mins"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Associated Course */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Associated Course (Optional)</label>
                  <select
                    value={editingEvent.courseTitle || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const courseId =
                        title === 'Weather Forecasting Fundamentals'
                          ? 'course_001'
                          : title === 'Satellite Meteorology'
                          ? 'course_002'
                          : title === 'Python for Meteorological Data Analysis'
                          ? 'course_003'
                          : 'course_004';
                      setEditingEvent({ ...editingEvent, courseTitle: title, courseId });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="">None / Platform-wide Event</option>
                    <option value="Weather Forecasting Fundamentals">Weather Forecasting Fundamentals</option>
                    <option value="Satellite Meteorology">Satellite Meteorology</option>
                    <option value="Python for Meteorological Data Analysis">Python for Meteorological Data Analysis</option>
                    <option value="Weather Observation & Surface Instrumentation">Weather Observation & Surface Instrumentation</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingEvent.description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    placeholder="Provide detailed instructions, meeting links, or submission guidelines..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-2 px-5 text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Event...' : editingEvent._id ? 'Update Event' : 'Create & Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PERSONAL REMINDER MODAL */}
      {reminderModalEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">Configure Reminder</h3>
              </div>
              <button
                onClick={() => setReminderModalEvent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 font-semibold line-clamp-1">
                {reminderModalEvent.title}
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notify me before:</label>
                <select
                  value={reminderPreset}
                  onChange={(e) => setReminderPreset(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                >
                  <option value="15m">15 minutes before</option>
                  <option value="30m">30 minutes before (Standard for live sessions)</option>
                  <option value="1h">1 hour before</option>
                  <option value="1d">1 day before (Standard for deadlines)</option>
                  <option value="3d">3 days before</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Personal Note (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Bring Doppler tephigram printouts"
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setReminderModalEvent(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReminder}
                className="btn-primary py-1.5 px-4 text-xs font-semibold"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
