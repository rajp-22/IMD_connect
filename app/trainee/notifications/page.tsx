import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getNotifications } from '@/lib/data-service';
import Link from 'next/link';
import {
  Bell,
  Clock,
  AlertTriangle,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default async function TraineeNotificationsPage() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') {
    redirect('/login');
  }

  const notifications = await getNotifications(session.id);

  const getNotifIcon = (type?: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-5 h-5 text-rose-600" />;
      case 'competency_gap':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'recommendation':
        return <BookOpen className="w-5 h-5 text-blue-900" />;
      case 'cert_expiry':
        return <Award className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Smart Notification Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Contextual alerts for assessment deadlines, competency gaps, course updates, and certificate renewals.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notifications at this time.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition ${
                !n.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-slate-100 rounded-xl shrink-0 mt-0.5">
                  {getNotifIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{n.title}</h3>
                    {!n.read && (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl">{n.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {n.link && (
                <div className="shrink-0 pl-12 sm:pl-0">
                  <Link
                    href={n.link}
                    className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                  >
                    View Details
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
