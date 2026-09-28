'use client';

import React, { useState } from 'react';
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  HelpCircle,
  FileText,
  Calendar,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  Bot,
} from 'lucide-react';
import { IAICitation, IAIMessage } from '@/lib/types';

interface CapacityAIAssistantProps {
  courseTitle?: string;
  lessonTitle?: string;
  lessonContent?: string;
  initialMode?: 'explain' | 'summarize' | 'revision' | 'recommendation' | 'concept_questions' | 'chat';
}

export default function CapacityAIAssistant({
  courseTitle,
  lessonTitle,
  lessonContent,
  initialMode = 'chat',
}: CapacityAIAssistantProps) {
  const [messages, setMessages] = useState<IAIMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `Hello! I am **Capacity AI**, your official meteorological pedagogical assistant.

I can assist you with:
- **Explain**: *"Explain numerical weather prediction simply"*
- **Summarize**: *"Summarize this lesson"*
- **Revision**: *"Give me a revision plan for my assessment"*
- **Recommendation**: *"What should I learn next?"*
- **Practice**: *"Give me 5 practice questions from this module"*`,
      timestamp: new Date().toISOString(),
      suggestedFollowups: [
        'Explain numerical weather prediction simply',
        'Summarize this lesson',
        'Give me a revision plan for my assessment',
        'What should I learn next?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'explain' | 'summarize' | 'revision' | 'recommendation' | 'questions'>('explain');

  const sendMessage = async (promptText?: string, modeOverride?: string) => {
    const text = promptText || input;
    if (!text.trim() || loading) return;

    const userMsg: IAIMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          mode: modeOverride || 'chat',
          courseTitle,
          lessonTitle,
          lessonContent,
        }),
      });

      const data = await res.json();
      if (data.success && data.response) {
        const botMsg: IAIMessage = {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: data.response.message,
          timestamp: new Date().toISOString(),
          citations: data.response.citations,
          suggestedFollowups: data.response.suggestedFollowups,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `Capacity AI encountered a brief network delay. Please try again. (${e.message})`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionPrompt: string, mode: string) => {
    sendMessage(actionPrompt, mode);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md flex flex-col h-[700px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
            <Brain className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base tracking-tight">Capacity AI</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono">
                Pedagogical Engine Active
              </span>
            </div>
            <p className="text-xs text-blue-200">
              IMD Meteorological & Learning Assistant {courseTitle ? `• ${courseTitle}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Preset Action Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-xs overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('explain');
            handleQuickAction('Explain numerical weather prediction simply.', 'explain');
          }}
          className={`px-3 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'explain'
              ? 'border-blue-900 text-blue-900 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-700" />
          Explain
        </button>
        <button
          onClick={() => {
            setActiveTab('summarize');
            handleQuickAction('Summarize this lesson into key operational points.', 'summarize');
          }}
          className={`px-3 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'summarize'
              ? 'border-blue-900 text-blue-900 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-700" />
          Summarize
        </button>
        <button
          onClick={() => {
            setActiveTab('revision');
            handleQuickAction('Give me a revision plan for my assessment.', 'revision');
          }}
          className={`px-3 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'revision'
              ? 'border-blue-900 text-blue-900 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-purple-700" />
          Revision Plan
        </button>
        <button
          onClick={() => {
            setActiveTab('recommendation');
            handleQuickAction('What should I learn next based on my skill gaps?', 'recommendation');
          }}
          className={`px-3 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'recommendation'
              ? 'border-blue-900 text-blue-900 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          Recommendation
        </button>
        <button
          onClick={() => {
            setActiveTab('questions');
            handleQuickAction('Give me 5 practice concept questions from this module.', 'concept_questions');
          }}
          className={`px-3 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'questions'
              ? 'border-blue-900 text-blue-900 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-rose-700" />
          Practice Questions
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Brain className="w-4 h-4 text-amber-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-900 text-white shadow-xs rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-none space-y-2'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {/* Citations block (Feature 13 RAG) */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Authorized IMD Syllabus Citations:
                  </div>
                  {m.citations.map((c, i) => (
                    <div
                      key={i}
                      className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600"
                    >
                      <span className="font-semibold text-blue-900">{c.sourceDocument}</span> —{' '}
                      <span className="text-slate-500 italic">{c.sectionTitle}</span>
                      <p className="mt-0.5 text-slate-700 line-clamp-2">&ldquo;{c.snippet}&rdquo;</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Followups */}
              {m.suggestedFollowups && m.suggestedFollowups.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {m.suggestedFollowups.map((f, fi) => (
                    <button
                      key={fi}
                      onClick={() => sendMessage(f)}
                      className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full border border-blue-200 transition"
                    >
                      {f} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
              <span>Capacity AI is consulting IMD curriculum...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask Capacity AI anything about meteorology, forecasting, or your learning path..."
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-900"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
