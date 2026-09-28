'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CloudSun,
  User,
  Mail,
  Lock,
  Building2,
  Briefcase,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import PrototypeDisclaimer from '@/components/PrototypeDisclaimer';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Password123!',
    role: 'trainee',
    department: 'Regional Meteorological Centre',
    designation: 'Scientific Assistant',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        return;
      }

      setRegistered(true);
    } catch (err: any) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <PrototypeDisclaimer />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
            {!registered ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-950 text-amber-400 mx-auto flex items-center justify-center shadow-md mb-3">
                    <CloudSun className="w-7 h-7" />
                  </div>
                  <h1 className="text-xl font-extrabold text-blue-950 font-serif">
                    New Personnel Registration
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Apply for an official Capacity Connect training account
                  </p>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-blue-700 mt-0.5" />
                  <span>
                    <strong>Administrative Approval Required:</strong> As per IMD security policy,
                    all newly registered Trainee and Trainer accounts must be approved by the
                    System Administrator before accessing course modules.
                  </span>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. / Shri / Smt."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Official Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="officer@imd.gov.in"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Select Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        <option value="trainee">Trainee (Learner / Forecaster)</option>
                        <option value="trainer">Trainer (Instructor / Scientist)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Password123!"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        IMD Centre / Division
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g. RMC Chennai / NWP Division"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Official Designation
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="e.g. Scientific Assistant / Meteorologist"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Official Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{loading ? 'Submitting Registration...' : 'Submit Application'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-900 font-bold hover:underline">
                    Sign In
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-serif">
                  Registration Received Successfully!
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Your application for{' '}
                  <strong className="text-slate-900">
                    {formData.name} ({formData.role.toUpperCase()})
                  </strong>{' '}
                  has been recorded in the central database under <strong>Pending Approval</strong>.
                </p>

                <div className="my-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>How to Test Account Approval Now:</span>
                  </p>
                  <p>
                    1. Log in using the seeded Admin account:{' '}
                    <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300">
                      admin@capacityconnect.demo
                    </code>
                  </p>
                  <p>
                    2. Go to the <strong>Admin Dashboard &gt; User Management</strong>.
                  </p>
                  <p>
                    3. Click <strong>“Approve”</strong> on this pending user to activate full platform
                    access.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Link
                    href="/login?demo=admin"
                    className="px-4 py-2 bg-blue-950 text-white rounded-lg text-xs font-bold hover:bg-blue-900 transition"
                  >
                    Go to Admin Portal to Approve
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-300 transition"
                  >
                    Return to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
