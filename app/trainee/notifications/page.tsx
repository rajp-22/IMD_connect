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
  ArrowRight,
} from 'lucide-react';

export default async function TraineeNotificationsPage() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') {
    redirect('/login');
  }

  const notifications = await getNotifications(session.id);

  const getNotifMeta = (type?: string) => {
    switch (type) {
      case 'deadline':
        return {
          icon: Clock,
          category: 'Academic Deadline',
          badgeClass: 'badge-status-error',
          iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'competency_gap':
        return {
          icon: AlertTriangle,
          category: 'Competency Alert',
          badgeClass: 'badge-status-pending',
          iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'recommendation':
        return {
          icon: BookOpen,
          category: 'Smart Recommendation',
          badgeClass: 'badge-status-active',
          iconBg: 'bg-blue-50 text-blue-900 border-blue-200',
        };
      case 'cert_expiry':
        return {
          icon: Award,
          category: 'Certification Credential',
          badgeClass: 'badge-status-completed',
          iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      default:
        return {
          icon: Bell,
          category: 'Institutional Notice',
          badgeClass: 'badge-status-locked',
          iconBg: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Institutional Notifications
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official operational alerts, assessment scheduling deadlines, competency gap updates, and verified credential notices.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No active notifications</p>
            <p className="text-xs text-slate-400">
              You are completely caught up with your training milestones and assessments.
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const meta = getNotifMeta(n.type);
            const Icon = meta.icon;

            return (
              <div
                key={n._id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition ${
                  !n.read ? 'bg-blue-50/40 border-l-4 border-blue-950' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${meta.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${meta.badgeClass}`}>
                        {meta.category}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 font-serif">{n.title}</h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-900 shrink-0" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {n.link && (
                  <div className="shrink-0 pl-12 sm:pl-0">
                    <Link
                      href={n.link}
                      className="btn-secondary py-1.5 px-3 text-xs font-semibold text-blue-900 hover:text-blue-950"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
