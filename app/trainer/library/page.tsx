import { Library, FileText, Video, Presentation, Download, Eye, Sparkles } from 'lucide-react';

export default function TrainerLibraryPage() {
  const resources = [
    {
      title: 'Atmospheric Thermodynamic Equations & Tephigram Guide',
      type: 'PDF Document',
      size: '3.4 MB',
      course: 'Weather Forecasting Fundamentals',
      icon: FileText,
      url: '/docs/thermodynamics_guide.pdf',
    },
    {
      title: 'INSAT-3DR Multispectral Imaging Channels & RGB Composites',
      type: 'PPT Presentation',
      size: '12.8 MB',
      course: 'Satellite Meteorology',
      icon: Presentation,
      url: '/docs/insat_multispectral.pptx',
    },
    {
      title: 'Recorded Lecture: Severe Weather Nowcasting with Doppler Radars',
      type: 'Video Lecture',
      size: '142 MB',
      course: 'Weather Forecasting Fundamentals',
      icon: Video,
      url: 'https://youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      title: 'Xarray & MetPy Scripts for NetCDF Gridded Weather Data',
      type: 'Jupyter Notebook / Code',
      size: '1.2 MB',
      course: 'Python for Meteorological Data Analysis',
      icon: FileText,
      url: '/docs/metpy_xarray_walkthrough.ipynb',
    },
    {
      title: 'Dvorak Tropical Cyclone Intensity Classification Manual',
      type: 'Technical Manual (PDF)',
      size: '5.6 MB',
      course: 'Satellite Meteorology',
      icon: FileText,
      url: '/docs/dvorak_manual.pdf',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Faculty Teaching Resource Library
        </h1>
        <p className="text-xs text-slate-500">
          Centralized repository of lecture slides, presentation decks, recorded sessions, and
          operational guides for IMD instructors.
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
        <span>
          <strong>Prototype Content Notice:</strong> Resources are mock-referenced for technical
          demonstration. Production deployments connect directly with
          Ministry S3 / Supabase buckets.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 bg-slate-100 text-blue-900 rounded-lg">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.size}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-blue-900 font-medium mb-1">{item.type}</p>
                <p className="text-[11px] text-slate-500">Curriculum: {item.course}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-emerald-700 font-bold uppercase">
                  Verified Material
                </span>
                <button
                  onClick={() => alert(`Opening resource: ${item.title}`)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Resource</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
