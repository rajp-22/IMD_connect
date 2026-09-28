'use client';

import React, { useState } from 'react';
import {
  Library,
  Folder,
  FileText,
  Video,
  Presentation,
  Upload,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface ResourceItem {
  id: string;
  folder: string;
  title: string;
  type: 'video' | 'pdf' | 'presentation' | 'document';
  fileName: string;
  fileSize: string;
  usedInCourses: string[];
}

export default function TrainerLibraryPage() {
  const [activeFolder, setActiveFolder] = useState('All');
  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: 'res_1',
      folder: 'Weather Forecasting',
      title: 'Atmospheric Dynamics & Synoptic Systems Video Lecture',
      type: 'video',
      fileName: 'Lecture 01.mp4',
      fileSize: '420 MB',
      usedInCourses: ['Weather Forecasting Fundamentals'],
    },
    {
      id: 'res_2',
      folder: 'Weather Forecasting',
      title: 'Forecasting Notes & Tephigram Plotting Manual',
      type: 'pdf',
      fileName: 'Forecasting Notes.pdf',
      fileSize: '4.8 MB',
      usedInCourses: ['Weather Forecasting Fundamentals', 'Aviation Weather SOPs'],
    },
    {
      id: 'res_3',
      folder: 'Weather Forecasting',
      title: 'Standard Synoptic Analysis Protocols & Warning Criteria Deck',
      type: 'presentation',
      fileName: 'Forecasting.pptx',
      fileSize: '12.5 MB',
      usedInCourses: ['Weather Forecasting Fundamentals'],
    },
    {
      id: 'res_4',
      folder: 'Satellite Meteorology',
      title: 'Satellite Basics & INSAT-3DR Radiance Windows Reference',
      type: 'pdf',
      fileName: 'Satellite Basics.pdf',
      fileSize: '6.2 MB',
      usedInCourses: ['Satellite Meteorology'],
    },
    {
      id: 'res_5',
      folder: 'Satellite Meteorology',
      title: 'Dvorak Cyclone Pattern Interpretation & RGB Compositing Deck',
      type: 'presentation',
      fileName: 'Image Interpretation.pptx',
      fileSize: '18.4 MB',
      usedInCourses: ['Satellite Meteorology', 'Severe Cyclone Nowcasting'],
    },
  ]);

  const folders = ['All', 'Weather Forecasting', 'Satellite Meteorology'];

  const filteredResources =
    activeFolder === 'All' ? resources : resources.filter((r) => r.folder === activeFolder);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-rose-600" />;
      case 'presentation':
        return <Presentation className="w-4 h-4 text-amber-600" />;
      case 'pdf':
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleUploadSim = () => {
    const title = prompt('Enter resource title:');
    if (!title) return;
    const folder = prompt('Enter folder (e.g. Weather Forecasting or Satellite Meteorology):') || 'Weather Forecasting';
    const newRes: ResourceItem = {
      id: `res_${Date.now()}`,
      folder,
      title,
      type: 'pdf',
      fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '3.2 MB',
      usedInCourses: ['Weather Forecasting Fundamentals'],
    };
    setResources((prev) => [newRes, ...prev]);
    alert('Resource uploaded to trainer knowledge library and ready to reuse across courses!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Library className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              My Trainer Library (Feature 15)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organize reusable educational assets into folders and deploy across multiple courses without duplication.
          </p>
        </div>

        <button
          onClick={handleUploadSim}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Reusable Asset</span>
        </button>
      </div>

      {/* Folder Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFolder(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeFolder === f
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>{f}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFolder === f ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {f === 'All' ? resources.length : resources.filter((r) => r.folder === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="p-1.5 bg-slate-100 rounded-md">{getIcon(item.type)}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                    {item.folder}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                  {item.fileSize}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500 font-mono">{item.fileName}</p>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Used in Courses ({item.usedInCourses.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.usedInCourses.map((c, ci) => (
                    <span
                      key={ci}
                      className="text-[10px] bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200 truncate max-w-[200px]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => alert(`Previewing resource: ${item.fileName}`)}
                className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                onClick={() =>
                  alert(`Resource "${item.fileName}" can be linked directly into any new lesson or course module.`)
                }
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium flex items-center gap-1 transition"
              >
                <Share2 className="w-3 h-3" />
                <span>Reuse in Course</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
