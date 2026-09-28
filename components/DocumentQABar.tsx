'use client';

import React, { useState } from 'react';
import {
  FileSearch,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  X,
  Send,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { IAICitation } from '@/lib/types';

interface DocumentQABarProps {
  documentTitle: string;
  documentText?: string;
  courseTitle?: string;
  lessonTitle?: string;
}

export default function DocumentQABar({
  documentTitle,
  documentText = '',
  courseTitle,
  lessonTitle,
}: DocumentQABarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    message: string;
    citations?: IAICitation[];
  } | null>(null);

  const handleAsk = async (presetPrompt?: string) => {
    const q = presetPrompt || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai/document-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          documentTitle,
          documentText: documentText.slice(0, 3000), // send safe excerpt
          courseTitle,
          lessonTitle,
        }),
      });
      const data = await res.json();
      if (data.success && data.response) {
        setResponse({
          message: data.response.message,
          citations: data.response.citations,
        });
      }
    } catch (e: any) {
      setResponse({
        message: 'Unable to query this document right now. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 border border-blue-200 bg-blue-50/60 rounded-xl overflow-hidden shadow-xs">
      {/* Banner / Toggle Bar */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0">
            <FileSearch className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <span>Ask about this material</span>
              <span className="text-[10px] bg-blue-200/70 text-blue-900 px-1.5 py-0.2 rounded font-mono">
                RAG Grounded
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Query questions directly against &ldquo;{documentTitle}&rdquo; without hallucinations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{isOpen ? 'Close Q&A' : 'Ask Document'}</span>
        </button>
      </div>

      {/* Expanded Interactive Q&A Panel */}
      {isOpen && (
        <div className="p-4 pt-2 border-t border-blue-200 bg-white space-y-3">
          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            <button
              onClick={() => handleAsk('What are the main methods and key concepts discussed here?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-md border border-slate-200 transition"
            >
              Key Points Extraction
            </button>
            <button
              onClick={() => handleAsk('Summarize this lesson into 3 operational takeaways.')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-md border border-slate-200 transition"
            >
              Summarize
            </button>
            <button
              onClick={() => handleAsk('Extract key mathematical formulas or threshold values.')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-md border border-slate-200 transition"
            >
              Formulas & Thresholds
            </button>
            <button
              onClick={() => handleAsk('Generate 3 practice questions directly from this text.')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-md border border-slate-200 transition"
            >
              Practice Questions
            </button>
          </div>

          {/* Search/Query Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder={`Ask a question about ${documentTitle}...`}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading || !query.trim()}
              className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Ask</span>
            </button>
          </div>

          {/* Answer Box with Citations */}
          {loading && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
              <span>Analyzing document content and extracting citations...</span>
            </div>
          )}

          {response && (
            <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2.5 text-xs animate-in fade-in duration-150">
              <div className="font-semibold text-blue-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Response Grounded in Course Material:</span>
              </div>
              <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                {response.message}
              </div>

              {response.citations && response.citations.length > 0 && (
                <div className="pt-2 border-t border-blue-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Source Citation:
                  </span>
                  {response.citations.map((c, i) => (
                    <div key={i} className="p-2 bg-white rounded border border-blue-200 text-[11px] text-slate-700">
                      <div className="font-semibold text-blue-900">
                        {c.sourceDocument} — <span className="font-normal italic">{c.sectionTitle}</span>
                      </div>
                      <p className="mt-0.5 text-slate-600">&ldquo;{c.snippet}&rdquo;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
