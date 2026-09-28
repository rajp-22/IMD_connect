'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CloudSun,
  Bell,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Building2,
  ExternalLink,
  Search,
  Brain,
  CheckCircle2,
} from 'lucide-react';
import { ISessionUser, INotification } from '@/lib/types';
import KnowledgeSearchModal from './KnowledgeSearchModal';

interface HeaderProps {
  user?: ISessionUser | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoSwitch, setShowDemoSwitch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/notifications?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user?.id]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleQuickLogin = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'Password123!' }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowDemoSwitch(false);
        if (data.user.role === 'admin') router.push('/admin/dashboard');
        else if (data.user.role === 'trainer') router.push('/trainer/dashboard');
        else router.push('/trainee/dashboard');
        router.refresh();
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, markAll: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        {/* Top Gov Info Strip */}
        <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1 flex items-center justify-between">
          <div className="flex items-center space-x-3 max-w-7xl mx-auto w-full">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              भारत सरकार | Government of India
            </span>
            <span className="text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300">
              पृथ्वी विज्ञान मंत्रालय | Ministry of Earth Sciences (MoES)
            </span>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-[11px] text-slate-300 hidden md:inline">
                भारत मौसम विज्ञान विभाग | IMD
              </span>
            </div>
          </div>
        </div>

        <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

        {/* Main Navigation Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo and Title */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-md group-hover:bg-blue-800 transition">
                <CloudSun className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-blue-950 font-serif">
                    CAPACITY CONNECT
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                    IMD Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Learning Intelligence & Capacity Building | India Meteorological Department
                </p>
              </div>
            </Link>

            {/* Middle: Global Knowledge Search Trigger (Feature 14) */}
            <div className="hidden md:flex items-center">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 text-xs w-64 justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-blue-900" />
                  <span>Search knowledge base...</span>
                </div>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px] text-slate-500">
                  Ctrl+K
                </kbd>
              </button>
            </div>

            {/* Right Navigation & Controls */}
            <div className="flex items-center gap-2.5">
              {/* Quick AI Launch button */}
              {user && (
                <Link
                  href="/trainee/ai"
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition"
                  title="Open Capacity AI Assistant"
                >
                  <Brain className="w-3.5 h-3.5 text-blue-800" />
                  <span className="hidden sm:inline">Capacity AI</span>
                </Link>
              )}

              {/* Notification Center Bell (Feature 17) */}
              {user && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg relative transition"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    )}
                  </button>

                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] text-blue-700 hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">
                            No notifications at this time
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <Link
                              key={n._id}
                              href={n.link || '/trainee/notifications'}
                              onClick={() => setShowNotifs(false)}
                              className={`block p-3 hover:bg-slate-50 transition text-left ${
                                !n.read ? 'bg-blue-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <span className="font-semibold text-xs text-slate-800">
                                  {n.title}
                                </span>
                                {!n.read && (
                                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                {n.message}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>

                      <div className="px-3 py-2 border-t border-slate-100 text-center">
                        <Link
                          href="/trainee/notifications"
                          onClick={() => setShowNotifs(false)}
                          className="text-xs font-semibold text-blue-900 hover:underline"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Demo Switcher Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDemoSwitch(!showDemoSwitch)}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition"
                  title="Switch demo accounts instantly"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>Demo Switcher</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showDemoSwitch && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Switch Role (Demo)
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuickLogin('trainee@capacityconnect.demo')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center justify-between text-slate-800"
                    >
                      <div>
                        <div className="font-semibold text-blue-900">Pooja Iyer (Trainee)</div>
                        <div className="text-[10px] text-slate-500">RMC Mumbai, Sci. Asst-I</div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Trainee
                      </span>
                    </button>
                    <button
                      onClick={() => handleQuickLogin('trainer@capacityconnect.demo')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between text-slate-800"
                    >
                      <div>
                        <div className="font-semibold text-emerald-900">Dr. Rajesh Sharma (Trainer)</div>
                        <div className="text-[10px] text-slate-500">NWP Division, Sr. Scientist</div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Trainer
                      </span>
                    </button>
                    <button
                      onClick={() => handleQuickLogin('admin@capacityconnect.demo')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 flex items-center justify-between text-slate-800"
                    >
                      <div>
                        <div className="font-semibold text-amber-900">Dr. M. Mohapatra (Admin)</div>
                        <div className="text-[10px] text-slate-500">DG Meteorology, IMD HQ</div>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Admin
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition shadow-2xs"
                  >
                    <div className="text-right hidden sm:block leading-tight">
                      <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                        {user.role} • {user.department.substring(0, 18)}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                            Role: {user.role}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={
                          user.role === 'admin'
                            ? '/admin/dashboard'
                            : user.role === 'trainer'
                            ? '/trainer/dashboard'
                            : '/trainee/dashboard'
                        }
                        onClick={() => setShowUserMenu(false)}
                        className="block px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                      >
                        Dashboard
                      </Link>

                      <Link
                        href={
                          user.role === 'trainee'
                            ? '/trainee/passport'
                            : user.role === 'trainer'
                            ? '/trainer/profile'
                            : '/admin/users'
                        }
                        onClick={() => setShowUserMenu(false)}
                        className="block px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                      >
                        {user.role === 'trainee' ? 'Competency Passport' : 'Profile Settings'}
                      </Link>

                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5 font-medium border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 text-xs font-semibold text-blue-900 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md shadow-2xs transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <KnowledgeSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
