'use client';

import React, { useState } from 'react';
import { Check, X, ShieldAlert, UserCheck, AlertCircle } from 'lucide-react';
import { IUser } from '@/lib/types';

interface PendingUsersTableProps {
  initialUsers: IUser[];
}

export default function PendingUsersTable({ initialUsers }: PendingUsersTableProps) {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleUpdateStatus = async (userId: string, newStatus: 'approved' | 'rejected') => {
    setActionLoading(userId);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        setActionMessage(
          `User registration ${newStatus === 'approved' ? 'Approved' : 'Rejected'} successfully.`
        );
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        alert(data.error || 'Failed to update user status');
      }
    } catch (e) {
      console.error(e);
      alert('Network error updating user status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-900" />
            <span>Pending Personnel Registrations Awaiting Verification</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Trainee and Trainer applications requiring administrator sanction before platform
            entry.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
          {users.length} Pending
        </span>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Center / Division</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        u.role === 'trainer'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{u.department}</td>
                  <td className="py-3 px-4 text-slate-600">{u.designation}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(u._id, 'approved')}
                      disabled={actionLoading === u._id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold shadow-2xs transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{actionLoading === u._id ? 'Updating...' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to reject registration for ${u.name}?`)) {
                          handleUpdateStatus(u._id, 'rejected');
                        }
                      }}
                      disabled={actionLoading === u._id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded text-xs font-medium border border-slate-200 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-500">
          No pending account applications requiring administrative review.
        </div>
      )}
    </div>
  );
}
