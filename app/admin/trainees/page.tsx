import { getUsers } from '@/lib/data-service';
import { GraduationCap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminTraineesPage() {
  const users = await getUsers();
  const trainees = users.filter((u) => u.role === 'trainee');

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Enrolled Trainees & Scientific Officers
        </h1>
        <p className="text-xs text-slate-500">
          Official roster of meteorological assistants, forecasters, and observers participating in
          capacity programs.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>Total Trainee Officers: {trainees.length}</span>
          <span className="font-mono text-slate-500">Ministry of Earth Sciences</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Officer Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Regional Centre</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trainees.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{t.name}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{t.email}</td>
                  <td className="py-3 px-4 text-slate-700">{t.department}</td>
                  <td className="py-3 px-4 text-slate-700">{t.designation}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        t.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {new Date(t.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
