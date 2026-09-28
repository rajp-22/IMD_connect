import { Users, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { getEnrollments, getUsers, getCourses } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export default async function TrainerTraineesPage() {
  const [enrollments, users, courses] = await Promise.all([
    getEnrollments(),
    getUsers(),
    getCourses(),
  ]);

  const roster = enrollments.map((enr) => {
    const user = users.find((u) => u._id === enr.traineeId);
    const course = courses.find((c) => c._id === enr.courseId);
    return {
      id: enr._id,
      name: user?.name || 'Scientific Officer',
      email: user?.email || 'officer@imd.gov.in',
      department: user?.department || 'RMC Regional Center',
      courseName: course?.title || enr.courseTitle,
      progress: enr.progressPercentage,
      status: enr.status,
      assessmentScore: enr.assessmentScore ?? (enr.status === 'completed' ? 100 : '--'),
      certificateId: enr.certificateId,
    };
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Enrolled Trainee Officers Directory
        </h1>
        <p className="text-xs text-slate-500">
          Detailed breakdown of all officers enrolled in capacity building curricula, lesson
          completion rates, and examination scores.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Total Enrolled Officers: {roster.length}</span>
          <span className="text-slate-500 font-mono">Live Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Trainee Officer</th>
                <th className="py-3 px-4">Station / Center</th>
                <th className="py-3 px-4">Enrolled Course</th>
                <th className="py-3 px-4">Course Progress</th>
                <th className="py-3 px-4">Assessment Score</th>
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roster.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{row.name}</div>
                    <div className="text-[11px] text-slate-500">{row.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{row.department}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{row.courseName}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 font-mono">
                      <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            row.progress >= 100 ? 'bg-emerald-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${row.progress}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-800">{row.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {typeof row.assessmentScore === 'number'
                      ? `${row.assessmentScore}%`
                      : row.assessmentScore}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {row.certificateId || 'Pending Exam'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        row.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {row.status}
                    </span>
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
