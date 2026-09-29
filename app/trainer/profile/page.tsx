import { getSessionUser } from '@/lib/auth';
import { getTrainerProfile } from '@/lib/data-service';
import {
  User,
  Award,
  BookOpen,
  Star,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Sparkles,
  Compass,
  BarChart3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TrainerProfilePage() {
  const session = await getSessionUser();
  const trainerId = session?.id || 'usr_trainer_001';
  const profile = await getTrainerProfile(trainerId);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. PROFILE HEADER */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-emerald-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 text-2xl font-bold font-serif flex items-center justify-center shrink-0 shadow-md">
              {profile?.name?.charAt(0) || 'D'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="badge-status-completed bg-emerald-900/90 text-emerald-300 border-emerald-600/50 font-mono">
                  Certified Faculty
                </span>
                <span className="text-xs text-emerald-200 font-mono">IMD HQ Faculty Pool</span>
              </div>
              <h1 className="text-2xl font-bold font-serif">{profile?.name || 'Dr. Rajesh Sharma'}</h1>
              <p className="text-xs text-blue-200 mt-0.5">
                {profile?.designation || 'Senior Scientist & Chief Instructor'} •{' '}
                {profile?.department || 'Numerical Weather Prediction Division, IMD HQ'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ABOUT & PROFESSIONAL SUMMARY */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
          <User className="w-4 h-4 text-blue-900" />
          <span>2. Professional Background & Bio</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          {profile?.bio ||
            'Over 14 years of research and operational weather forecasting leadership at IMD HQ. Specialized in synoptic analysis, NWP models (WRF, GFS), and training national forecasters for cyclonic and monsoon weather tracking.'}
        </p>
      </div>

      {/* 3. EXPERIENCE */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
          <Briefcase className="w-4 h-4 text-blue-900" />
          <span>3. Operational & Teaching Experience</span>
        </h2>
        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 font-serif">Senior Scientist & Lead NWP Instructor</h3>
              <p className="text-slate-600">Numerical Weather Prediction Division, IMD HQ</p>
            </div>
            <span className="font-mono font-bold text-slate-700 px-2.5 py-1 bg-white rounded-lg border border-slate-200">
              {profile?.experienceYears || 14} Years
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 font-serif">Visiting Lecturer & Practical Examiner</h3>
              <p className="text-slate-600">IMD Training Directorate, Pune</p>
            </div>
            <span className="font-mono font-bold text-slate-700 px-2.5 py-1 bg-white rounded-lg border border-slate-200">
              6 Years
            </span>
          </div>
        </div>
      </div>

      {/* 4. EDUCATION */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
          <GraduationCap className="w-4 h-4 text-blue-900" />
          <span>4. Academic Education & Fellowships</span>
        </h2>
        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 font-serif">Ph.D. in Atmospheric Sciences (Numerical Modeling)</h3>
              <p className="text-slate-600">Indian Institute of Technology (IIT) Delhi</p>
            </div>
            <span className="font-mono font-bold text-slate-700 px-2.5 py-1 bg-white rounded-lg border border-slate-200">
              2011
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 font-serif">M.Tech. Physical Meteorology</h3>
              <p className="text-slate-600">University of Pune</p>
            </div>
            <span className="font-mono font-bold text-slate-700 px-2.5 py-1 bg-white rounded-lg border border-slate-200">
              2007
            </span>
          </div>
        </div>
      </div>

      {/* 5. SKILLS & SPECIALIZATIONS */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
          <Sparkles className="w-4 h-4 text-blue-900" />
          <span>5. Specialization Domains</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            'High-Resolution NWP Modeling (WRF, GFS)',
            'Synoptic Chart Diagnostic Interpretation',
            'Severe Convection & Nowcasting',
            'Doppler Radar Velocity De-aliasing',
            'Python for Meteorology (MetPy, NetCDF4, Cartopy)',
            'Monsoon Depression Dynamics',
          ].map((skill, idx) => (
            <span
              key={idx}
              className="text-xs bg-slate-50 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 6. COMPETENCIES */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
          <Compass className="w-4 h-4 text-emerald-700" />
          <span>6. Verified Faculty Competencies (Matching Matrix)</span>
        </h2>
        <div className="space-y-2.5 text-xs">
          {profile?.competencies.map((c, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900 font-serif">{c.name}</span>
                <span className="text-slate-500 ml-2 font-mono text-[11px]">({c.domain})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-900 font-mono text-sm">{c.score}%</span>
                <span className="badge-status-completed font-mono">Verified Mastery</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. CERTIFICATES & FACULTY ACCREDITATION */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
          <Award className="w-4 h-4 text-purple-700" />
          <span>7. Faculty Accreditations</span>
        </h2>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 font-serif">
                IMD Senior Faculty Accreditation • NWP Master Trainer
              </h4>
              <p className="text-[11px] text-slate-500 font-mono">
                Sanctioned by Director General of Meteorology, IMD HQ
              </p>
            </div>
          </div>
          <span className="badge-status-completed font-mono">Active</span>
        </div>
      </div>

      {/* 8. TEACHING & TRAINING STATISTICS */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 font-serif">
          <BarChart3 className="w-4 h-4 text-blue-900" />
          <span>8. Faculty Training Statistics</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Courses Authored</span>
            <span className="text-xl font-bold font-mono text-slate-900">{profile?.totalCourses || 2}</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Officers Taught</span>
            <span className="text-xl font-bold font-mono text-emerald-700">{profile?.totalStudentsTaught || 142}</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Faculty Rating</span>
            <span className="text-xl font-bold font-mono text-amber-600 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              {profile?.rating || 4.9}
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Passing Rate</span>
            <span className="text-xl font-bold font-mono text-blue-900">94%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
