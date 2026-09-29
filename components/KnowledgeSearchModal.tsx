'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  FileText,
  Library,
  Compass,
  FileCheck2,
  X,
  ArrowRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface SearchResult {
  type: 'course' | 'lesson' | 'resource' | 'competency' | 'assessment';
  title: string;
  subtitle: string;
  link: string;
  icon: string;
}

interface KnowledgeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KnowledgeSearchModal({ isOpen, onClose }: KnowledgeSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Group results by type (Point 18 Requirement)
  const groupedResults = useMemo(() => {
    const groups: {
      courses: SearchResult[];
      resources: SearchResult[];
      lessons: SearchResult[];
      competencies: SearchResult[];
      assessments: SearchResult[];
    } = {
      courses: [],
      resources: [],
      lessons: [],
      competencies: [],
      assessments: [],
    };

    results.forEach((item) => {
      if (item.type === 'course') groups.courses.push(item);
      else if (item.type === 'resource') groups.resources.push(item);
      else if (item.type === 'lesson') groups.lessons.push(item);
      else if (item.type === 'competency') groups.competencies.push(item);
      else if (item.type === 'assessment') groups.assessments.push(item);
      else groups.courses.push(item);
    });

    return groups;
  }, [results]);

  if (!isOpen) return null;

  const handleSelect = (link: string) => {
    onClose();
    router.push(link);
  };

  const renderGroup = (
    label: string,
    items: SearchResult[],
    IconComponent: React.ComponentType<{ className?: string }>,
    badgeClass: string
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-1 py-2">
        <div className="px-3 py-1 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <IconComponent className="w-3.5 h-3.5 text-blue-900" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{items.length} found</span>
        </div>

        <div className="space-y-1">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(item.link)}
              className="w-full text-left p-2.5 hover:bg-slate-100/80 rounded-xl transition flex items-center justify-between group border border-transparent hover:border-slate-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 font-mono ${badgeClass}`}>
                  {item.type}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 group-hover:text-blue-950 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {item.subtitle}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-blue-950 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across courses, lessons, resources, competencies, assessments..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-900 shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100">
          {query.trim().length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Type a keyword to search MeghSetu Knowledge Base</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['Weather Forecasting', 'Tephigram', 'INSAT', 'NetCDF', 'Stevenson Screen'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm font-semibold text-slate-800">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for broader terms like synoptic, radar, satellite, or observation.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {renderGroup('COURSES', groupedResults.courses, BookOpen, 'badge-status-active')}
              {renderGroup('LEARNING MATERIAL', groupedResults.resources, Library, 'badge-status-pending')}
              {renderGroup('LESSONS', groupedResults.lessons, FileText, 'badge-status-completed')}
              {renderGroup('COMPETENCIES', groupedResults.competencies, Compass, 'badge-status-error')}
              {renderGroup('ASSESSMENTS', groupedResults.assessments, FileCheck2, 'badge-status-active')}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Use Tab and Arrow keys or Enter to select</span>
          <kbd className="font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
            Esc to exit
          </kbd>
        </div>
      </div>
    </div>
  );
}
