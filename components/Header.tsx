'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  revealOnScroll?: boolean;
}

export default function Header({ user, revealOnScroll = false }: HeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoSwitch, setShowDemoSwitch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(!revealOnScroll);

  // Scroll listener for revealOnScroll mode
  useEffect(() => {
    if (!revealOnScroll) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [revealOnScroll]);

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
      <header
        className={`z-50 transition-all duration-300 ease-in-out ${
          revealOnScroll
            ? `fixed top-0 inset-x-0 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-md ${
                isScrolled
                  ? 'translate-y-0 opacity-100 pointer-events-auto'
                  : '-translate-y-full opacity-0 pointer-events-none'
              }`
            : 'sticky top-0 bg-white border-b border-slate-200 shadow-xs'
        }`}
      >
        {/* Main Navigation Header */}
        <div className="portal-container">
          <div className="flex items-center justify-between gap-3 h-16">
            {/* Brand Logo and Title */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden bg-white flex items-center justify-center shadow-xs border border-slate-200 group-hover:border-blue-400 transition shrink-0 p-0.5">
                <Image
                  src="/logo.jpg"
                  alt="MeghSetu Logo"
                  width={44}
                  height={44}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-blue-950">
                    MEGHSETU
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                    IMD Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal hidden xl:block">
                  Learning Intelligence & Capacity Building | India Meteorological Department
                </p>
              </div>
            </Link>

            {/* Middle: Global Knowledge Search Trigger (Desktop) */}
            <div className="hidden lg:flex items-center shrink-0">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 h-9 bg-slate-100 hover:bg-slate-200/90 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 hover:border-blue-400 text-sm font-medium w-48 xl:w-64 justify-between transition-all duration-200 shadow-2xs group focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-4 h-4 text-blue-900 transition-transform duration-200 group-hover:scale-110 shrink-0" />
                  <span className="group-hover:text-slate-900 transition-colors truncate">Search knowledge...</span>
                </div>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[11px] text-slate-500 shadow-2xs group-hover:border-slate-400 shrink-0">
                  Ctrl+K
                </kbd>
              </button>
            </div>

            {/* Right Navigation & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Mobile / Tablet Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="lg:hidden p-2 h-8 w-8 flex items-center justify-center text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition"
                title="Search knowledge base"
              >
                <Search className="w-4 h-4 text-blue-900" />
              </button>

              {/* Quick AI Launch button */}
              {user && (
                <Link
                  href="/trainee/ai"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-950 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 shadow-2xs hover:shadow-xs group whitespace-nowrap"
                  title="Open MeghSetu AI Assistant"
                >
                  <Brain className="w-4 h-4 text-blue-800 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shrink-0" />
                  <span className="hidden sm:inline">MeghSetu AI</span>
                </Link>
              )}

              {/* Notification Center Bell */}
              {user && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="p-2 h-8 w-8 flex items-center justify-center text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg relative transition border border-transparent hover:border-slate-200"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse ring-2 ring-white" />
                    )}
                  </button>

                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
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
                  className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/90 border border-slate-300 hover:border-slate-400 rounded-lg transition-all duration-200 shadow-2xs hover:shadow-xs group whitespace-nowrap"
                  title="Switch demo accounts instantly"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-800 transition-transform duration-200 group-hover:scale-110 shrink-0" />
                  <span>Demo Switcher</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform duration-200 group-hover:translate-y-0.5 shrink-0" />
                </button>

                {showDemoSwitch && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Switch Role (Demo)
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuickLogin('trainee@capacityconnect.demo')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center justify-between text-slate-800 transition"
                    >
                      <div>
                        <div className="font-semibold text-blue-900 text-[13px]">Pooja Iyer (Trainee)</div>
                        <div className="text-[11px] text-slate-500">RMC Mumbai, Sci. Asst-I</div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-[11px] px-1.5 py-0.5 rounded font-medium">
                        Trainee
                      </span>
                    </button>
                    <button
                      onClick={() => handleQuickLogin('trainer@capacityconnect.demo')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between text-slate-800 transition"
                    >
                      <div>
                        <div className="font-semibold text-emerald-900 text-[13px]">Dr. Rajesh Sharma (Trainer)</div>
                        <div className="text-[11px] text-slate-500">NWP Division, Sr. Scientist</div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] px-1.5 py-0.5 rounded font-medium">
                        Trainer
                      </span>
                    </button>
                    <button
                      onClick={() => handleQuickLogin('admin@capacityconnect.demo')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 flex items-center justify-between text-slate-800 transition"
                    >
                      <div>
                        <div className="font-semibold text-amber-900 text-[13px]">Dr. M. Mohapatra (Admin)</div>
                        <div className="text-[11px] text-slate-500">DG Meteorology, IMD HQ</div>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-[11px] px-1.5 py-0.5 rounded font-medium">
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
                    className="flex items-center gap-2.5 pl-3 pr-2 py-1 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 transition-all duration-200 shadow-2xs hover:shadow-xs group"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-950 transition-colors leading-tight">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium tracking-wide">
                        <span className="uppercase font-semibold text-blue-900">{user.role}</span>
                        {user.department && (
                          <>
                            <span className="mx-1 text-slate-300">•</span>
                            <span className="truncate max-w-[140px] inline-block align-bottom" title={user.department}>
                              {user.department}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-blue-950 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-blue-100 shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0" />
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
