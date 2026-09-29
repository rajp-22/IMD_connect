'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Filter,
  Search,
  UserCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { IUser, UserRole, UserStatus } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId: string, newStatus: UserStatus) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
        );
      } else {
        alert('Failed to update user status.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    if (!confirm(`Confirm changing user's official role to ${newRole.toUpperCase()}?`)) return;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        alert('Failed to update user role.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Central Personnel & Cadre Management
        </h1>
        <p className="text-xs text-slate-500">
          Sanction registrations, grant role privileges, deactivate separated personnel, and oversee
          faculty credentials.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or regional station..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded border border-slate-300 bg-white"
            >
              <option value="all">All Roles</option>
              <option value="trainee">Trainee</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded border border-slate-300 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved / Active</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Officer Name</th>
                <th className="py-3 px-4">Center / Division</th>
                <th className="py-3 px-4">Cadre Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800">{u.department}</div>
                    <div className="text-[10px] text-slate-500">{u.designation}</div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u._id, e.target.value as UserRole)}
                      disabled={actionLoading === u._id}
                      className="px-2 py-0.5 text-[11px] font-bold rounded border border-slate-300 bg-white font-mono"
                    >
                      <option value="trainee">TRAINEE</option>
                      <option value="trainer">TRAINER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        u.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.status === 'pending'
                          ? 'bg-amber-100 text-amber-900 font-black'
                          : u.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {u.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(u._id, 'approved')}
                          disabled={actionLoading === u._id}
                          className="btn-primary py-1 px-2.5 text-[11px] font-bold"
                        >
                          Sanction
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Reject registration for ${u.name}?`)) {
                              handleUpdateStatus(u._id, 'rejected');
                            }
                          }}
                          disabled={actionLoading === u._id}
                          className="btn-secondary py-1 px-2 text-[11px] hover:text-red-700 hover:border-red-300"
                        >
                          Reject
                        </button>
                      </>
                    ) : u.status === 'approved' ? (
                      <button
                        onClick={() => {
                          if (confirm(`Confirm deactivating account for ${u.name}?`)) {
                            handleUpdateStatus(u._id, 'inactive');
                          }
                        }}
                        disabled={actionLoading === u._id}
                        className="btn-secondary py-1 px-2.5 text-[11px] text-slate-600 hover:text-amber-800 hover:border-amber-300"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(u._id, 'approved')}
                        disabled={actionLoading === u._id}
                        className="btn-secondary py-1 px-2.5 text-[11px] text-blue-900 border-blue-200 hover:bg-blue-50"
                      >
                        Re-activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">No personnel records found</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Try adjusting your search query or filter by different roles and statuses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
