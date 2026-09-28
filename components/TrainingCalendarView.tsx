'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { ITrainingEvent } from '@/lib/types';

interface TrainingCalendarViewProps {
  events: ITrainingEvent[];
  userRole?: string;
}

export default function TrainingCalendarView({
  events,
  userRole = 'trainee',
}: TrainingCalendarViewProps) {
  const [filterType, setFilterType] = useState('all');

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const getEventBadge = (type: ITrainingEvent['type']) => {
    switch (type) {
      case 'live_session':
        return {
          icon: <Video className="w-3.5 h-3.5 text-blue-700" />,
          label: 'Live Session',
          className: 'bg-blue-50 text-blue-900 border-blue-200',
        };
      case 'assessment_deadline':
        return {
          icon: <FileCheck2 className="w-3.5 h-3.5 text-rose-700" />,
          label: 'Assessment Deadline',
          className: 'bg-rose-50 text-rose-900 border-rose-200 font-bold',
        };
      case 'course_start':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-emerald-700" />,
          label: 'Course Start',
          className: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        };
      case 'workshop':
        return {
          icon: <Award className="w-3.5 h-3.5 text-purple-700" />,
          label: 'National Workshop',
          className: 'bg-purple-50 text-purple-900 border-purple-200',
        };
      case 'cert_expiry':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-700" />,
          label: 'Certificate Expiry',
          className: 'bg-amber-50 text-amber-900 border-amber-200',
        };
      default:
        return {
          icon: <CalendarIcon className="w-3.5 h-3.5 text-slate-700" />,
          label: 'Training Event',
          className: 'bg-slate-50 text-slate-800 border-slate-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header with Filters */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">
              {userRole === 'trainer' ? 'Faculty Teaching Schedule' : 'Personalized Training Calendar'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized with IMD national training schedule, live Webex sessions, and assessment deadlines.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'live_session', label: 'Live Sessions' },
            { id: 'assessment_deadline', label: 'Deadlines' },
            { id: 'course_start', label: 'Batch Starts' },
            { id: 'workshop', label: 'Workshops' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                filterType === tab.id
                  ? 'bg-blue-900 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List Timeline */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => {
          const badge = getEventBadge(evt.type);
          const dateObj = new Date(evt.date);

          return (
            <div
              key={evt._id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                {/* Date Block */}
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 text-center flex flex-col justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-blue-900">
                    {dateObj.toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 leading-tight">
                    {dateObj.getDate()}
                  </span>
                  <span className="text-[9px] text-slate-500">2026</span>
                </div>

                {/* Event Details */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${badge.className}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                    {evt.time && (
                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {evt.time}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{evt.title}</h3>
                  <p className="text-xs text-slate-600 max-w-2xl">{evt.description}</p>
                  {evt.locationOrLink && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-900" />
                      <span>{evt.locationOrLink}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div className="shrink-0 pl-20 md:pl-0">
                {evt.courseId ? (
                  <Link
                    href={`/courses/${evt.courseId}`}
                    className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                  >
                    <span>View Course</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                    Registered
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
