'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CloudSun,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Building2,
} from 'lucide-react';
import Header from '@/components/Header';
import PrototypeDisclaimer from '@/components/PrototypeDisclaimer';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const demoParam = searchParams.get('demo');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (demoParam === 'admin') {
      setEmail('admin@capacityconnect.demo');
      setPassword('Password123!');
    } else if (demoParam === 'trainer') {
      setEmail('trainer@capacityconnect.demo');
      setPassword('Password123!');
    } else if (demoParam === 'trainee') {
      setEmail('trainee@capacityconnect.demo');
      setPassword('Password123!');
    }
  }, [demoParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatusMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.status === 'pending') {
          setStatusMessage(
            'Your account registration is currently pending administrative approval from IMD HQ. Please contact the administrator or test with the approved demo accounts below.'
          );
        } else {
          setError(data.error || 'Login failed. Please check your credentials.');
        }
        return;
      }

      // Route based on role
      const user = data.user;
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'trainer') {
        router.push('/trainer/dashboard');
      } else {
        router.push('/trainee/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (role: 'trainee' | 'trainer' | 'admin') => {
    if (role === 'admin') setEmail('admin@capacityconnect.demo');
    if (role === 'trainer') setEmail('trainer@capacityconnect.demo');
    if (role === 'trainee') setEmail('trainee@capacityconnect.demo');
    setPassword('Password123!');
    setError('');
    setStatusMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <PrototypeDisclaimer />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-950 text-amber-400 mx-auto flex items-center justify-center shadow-md mb-3">
                <CloudSun className="w-7 h-7" />
              </div>
              <h1 className="text-xl font-extrabold text-blue-950 font-serif">
                IMD Official Portal Sign In
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials to access MeghSetu
              </p>
            </div>

            {/* Error or Status message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {statusMessage && (
              <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@imd.gov.in or demo email"
                    className="input-gov !pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Demo: Password123!</span>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="input-gov !pl-10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 px-4 text-xs font-bold shadow-md"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Demo Credentials Autofill */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
                Pre-Configured Demo Accounts:
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <button
                  type="button"
                  onClick={() => setDemoAccount('trainee')}
                  className="p-2 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-950 text-xs font-semibold transition"
                >
                  <span className="block font-bold">Trainee</span>
                  <span className="text-[10px] text-blue-700 font-mono">Pooja Iyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoAccount('trainer')}
                  className="p-2 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 text-xs font-semibold transition"
                >
                  <span className="block font-bold">Trainer</span>
                  <span className="text-[10px] text-emerald-700 font-mono">Dr. Sharma</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoAccount('admin')}
                  className="p-2 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-950 text-xs font-semibold transition"
                >
                  <span className="block font-bold">Admin</span>
                  <span className="text-[10px] text-amber-700 font-mono">DG Mohapatra</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-slate-500">
              Don&apos;t have an approved account?{' '}
              <Link href="/register" className="text-blue-900 font-bold hover:underline">
                Register as Trainee / Trainer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading portal login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
