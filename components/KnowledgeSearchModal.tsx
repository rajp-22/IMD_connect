'use client';

import React, { useState, useEffect } from 'react';
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

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'lesson':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'resource':
        return <Library className="w-4 h-4 text-purple-600" />;
      case 'competency':
        return <Compass className="w-4 h-4 text-amber-600" />;
      case 'assessment':
        return <FileCheck2 className="w-4 h-4 text-rose-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleSelect = (link: string) => {
    onClose();
    router.push(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-blue-900 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across courses, lessons, resources, competencies, assessments... (e.g. humidity, tephigram, python)"
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
            autoFocus
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-900" />}
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-2 overflow-y-auto flex-1 divide-y divide-slate-100">
          {query.trim().length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Type a keyword to search IMD Capacity Connect Knowledge Base</p>
              <div className="flex justify-center gap-2 pt-2">
                {['Weather Forecasting', 'Tephigram', 'INSAT', 'NetCDF', 'Stevenson Screen'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-600 px-2 py-1 rounded border border-slate-200"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for broader terms like synoptic, radar, satellite, or observation.
              </p>
            </div>
          ) : (
            results.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item.link)}
                className="w-full text-left p-3 hover:bg-blue-50/70 transition-colors flex items-center justify-between group rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-md group-hover:bg-white shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-900">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500">{item.subtitle}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-900 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Global Search (Feature 14)</span>
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Esc</kbd> to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
