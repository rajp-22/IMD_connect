'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  HelpCircle,
  FileText,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Upload,
  FileUp,
  Trash2,
  ExternalLink,
  ChevronRight,
  Database,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { IRAGDocument, IRAGCitation, KnowledgeSourceType } from '@/lib/rag/types';

interface ExtendedAIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: {
    sourceDocument: string;
    sectionTitle?: string;
    pageNumber?: number;
    snippet: string;
    score?: number;
  }[];
  suggestedFollowups?: string[];
  sourceUsed?: KnowledgeSourceType;
  confidenceScore?: number;
}

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
  // Chat messages
  const [messages, setMessages] = useState<ExtendedAIMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `Hello! I am **MeghSetu AI**, your official meteorological pedagogical assistant for the India Meteorological Department.

I operate with **Grounded RAG Intelligence** directly anchored in official IMD curriculum handbooks and authorized learning resources. You can query core meteorological principles or upload a PDF to chat directly with your study material.

How can I assist your studies today?`,
      timestamp: new Date().toISOString(),
      suggestedFollowups: [
        'What is atmospheric thermodynamics?',
        'Explain numerical weather prediction simply',
        'What are the main types of satellite orbits discussed?',
        'Create practice questions',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // RAG Document & Context State
  const [documents, setDocuments] = useState<IRAGDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<IRAGDocument | null>(null);
  const [knowledgeSource, setKnowledgeSource] = useState<KnowledgeSourceType>('platform');
  const [showDocTray, setShowDocTray] = useState(false);

  // Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Citation Inspection Modal
  const [inspectedCitation, setInspectedCitation] = useState<{
    sourceDocument: string;
    sectionTitle?: string;
    pageNumber?: number;
    snippet: string;
    score?: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load accessible documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/rag/documents');
      const data = await res.json();
      if (data.success && Array.isArray(data.documents)) {
        setDocuments(data.documents);
        // If a demo satellite handbook exists, keep it easily selectable
        if (!activeDocument) {
          const demoDoc = data.documents.find(
            (d: IRAGDocument) => d.id === 'doc_satellite_meteorology_handbook'
          );
          if (demoDoc) {
            // Document is loaded and ready
          }
        }
      }
    } catch (e) {
      console.error('Failed to load RAG documents:', e);
    }
  };

  // Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input for repeated uploads
    e.target.value = '';

    // Client-side validations
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadError('Invalid file format. Please upload a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError(`File size exceeds 25MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    setUploadError(null);
    setUploading(true);
    setUploadProgress(15);
    setUploadStage('Reading document...');

    const formData = new FormData();
    formData.append('file', file);
    if (courseTitle) formData.append('courseTitle', courseTitle);

    // Simulate progressive processing states for realistic feedback
    const timer1 = setTimeout(() => {
      setUploadProgress(45);
      setUploadStage('Extracting content...');
    }, 600);

    const timer2 = setTimeout(() => {
      setUploadProgress(75);
      setUploadStage('Preparing knowledge & generating embeddings...');
    }, 1400);

    try {
      const res = await fetch('/api/rag/upload', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process document');
      }

      setUploadProgress(100);
      setUploadStage('Ready to chat');

      const newDoc: IRAGDocument = data.document;
      setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);

      // Enter PDF chat mode for this newly uploaded document
      setTimeout(() => {
        setUploading(false);
        setShowUploadModal(false);
        enterPdfChatMode(newDoc);
      }, 500);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setUploading(false);
      setUploadError(err.message || 'Unable to process this document. Please try again.');
    }
  };

  const enterPdfChatMode = (doc: IRAGDocument) => {
    setActiveDocument(doc);
    setKnowledgeSource('pdf');
    setShowDocTray(false);

    // Add confirmation message
    const welcomeMsg: ExtendedAIMessage = {
      id: `bot_doc_${Date.now()}`,
      role: 'assistant',
      content: `📄 **Active Document Loaded:** "${doc.name}"
- **Pages:** ${doc.totalPages}
- **Status:** Ready • Knowledge Indexed
${doc.detectedTopics && doc.detectedTopics.length > 0 ? `- **Topics Detected:** ${doc.detectedTopics.join(', ')}` : ''}

You are now in **Document-Specific Chat Mode**. All answers will be strictly grounded in this document with page citations. What would you like to know?`,
      timestamp: new Date().toISOString(),
      suggestedFollowups: [
        'Summarize this document',
        'What are the main types of satellite orbits discussed?',
        'Explain the Dvorak technique described in this PDF',
        'What are the key topics in this document?',
      ],
      sourceUsed: 'pdf',
    };
    setMessages((prev) => [...prev, welcomeMsg]);
  };

  const exitPdfChatMode = () => {
    setActiveDocument(null);
    setKnowledgeSource('platform');

    const exitMsg: ExtendedAIMessage = {
      id: `bot_exit_${Date.now()}`,
      role: 'assistant',
      content: `Switched back to **MeghSetu Knowledge Base**. Queries are now evaluated against official IMD training manuals, syllabus standards, and operational guidelines.`,
      timestamp: new Date().toISOString(),
      suggestedFollowups: [
        'What is atmospheric thermodynamics?',
        'Explain numerical weather prediction simply',
        'What is CAPE and CIN on a Tephigram?',
        'What are the stages of cyclone warnings?',
      ],
      sourceUsed: 'platform',
    };
    setMessages((prev) => [...prev, exitMsg]);
  };

  const handleDeleteDocument = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/rag/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
        if (activeDocument?.id === docId) {
          exitPdfChatMode();
        }
      }
    } catch (e) {
      console.error('Failed to delete document:', e);
    }
  };

  // Dynamic Suggested Prompts based on active mode
  const currentSuggestedPrompts = activeDocument
    ? [
        { label: 'Summarize document', icon: FileText, prompt: 'Summarize this document into key operational takeaways and formulas.' },
        { label: 'What are satellite orbits?', icon: Sparkles, prompt: 'What are the main types of satellite orbits discussed in this document?' },
        { label: 'Explain Dvorak technique', icon: BookOpen, prompt: 'Explain the Dvorak technique described in this PDF.' },
        { label: 'Create practice questions', icon: HelpCircle, prompt: 'Create 3 practice assessment questions directly from this document.' },
      ]
    : [
        { label: 'Atmospheric thermodynamics', icon: Sparkles, prompt: 'What is atmospheric thermodynamics?' },
        { label: 'Explain NWP models', icon: FileText, prompt: 'Explain numerical weather prediction simply.' },
        { label: 'CAPE & CIN on Tephigram', icon: BookOpen, prompt: 'What is CAPE and CIN on an IMD Tephigram?' },
        { label: 'Cyclone warning stages', icon: HelpCircle, prompt: 'What are the 4 stages of tropical cyclone warnings in IMD?' },
      ];

  // Send message through RAG
  const sendMessage = async (promptText?: string) => {
    const text = promptText || input;
    if (!text.trim() || loading) return;

    const userMsg: ExtendedAIMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          sourceFilter: knowledgeSource,
          documentId: activeDocument ? activeDocument.id : undefined,
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.response) {
        const r = data.response;
        const botMsg: ExtendedAIMessage = {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: r.answer,
          timestamp: new Date().toISOString(),
          citations: r.citations,
          suggestedFollowups: r.suggestedFollowups,
          sourceUsed: r.sourceUsed,
          confidenceScore: r.confidenceScore,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Failed to retrieve grounded answer');
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `MeghSetu AI encountered an issue processing your query: ${e.message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[740px] overflow-hidden relative">
      {/* 1. Header with Institutional Identity & PDF Upload Trigger */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white flex items-center justify-between border-b border-blue-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900/80 border border-blue-700/60 flex items-center justify-center shadow-xs">
            <Brain className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base tracking-tight font-serif">MeghSetu AI Assistant</h2>
              <span className="badge-status-completed bg-emerald-950/80 text-emerald-300 border-emerald-600/50">
                Grounded RAG
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Official Pedagogical Support Engine • India Meteorological Department
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">
          {/* Upload PDF Button */}
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-blue-950 text-xs font-bold rounded-lg shadow-xs transition group"
            title="Upload PDF to chat with your document"
          >
            <Upload className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span>Upload PDF</span>
          </button>

          {/* Document Tray Toggle */}
          <button
            type="button"
            onClick={() => setShowDocTray(!showDocTray)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg border border-white/20 transition"
            title="View indexed documents"
          >
            <Database className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Documents ({documents.length})</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-blue-200 font-mono pl-2 border-l border-blue-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>MoES Grounded</span>
          </div>
        </div>
      </div>

      {/* 2. Active Mode & Knowledge Source Indicator Bar */}
      <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Active Context:
          </span>
          {activeDocument ? (
            <span className="font-semibold text-blue-950 flex items-center gap-1.5 truncate">
              <FileText className="w-3.5 h-3.5 text-blue-900 shrink-0" />
              <span className="truncate">{activeDocument.name}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                ({activeDocument.totalPages} pages • Indexed)
              </span>
            </span>
          ) : (
            <span className="font-semibold text-slate-900 truncate">
              {courseTitle ? `${courseTitle} ${lessonTitle ? `• ${lessonTitle}` : ''}` : 'General IMD Meteorological Knowledge & Competency Architecture'}
            </span>
          )}
        </div>

        {/* Source Selector & Exit PDF Chat */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Source Selector */}
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setKnowledgeSource('platform')}
              className={`px-2 py-0.5 rounded-md font-medium transition ${
                knowledgeSource === 'platform'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Query official IMD platform knowledge"
            >
              MeghSetu Knowledge
            </button>
            {activeDocument && (
              <>
                <button
                  onClick={() => setKnowledgeSource('pdf')}
                  className={`px-2 py-0.5 rounded-md font-medium transition ${
                    knowledgeSource === 'pdf'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Query only the current PDF"
                >
                  Current PDF
                </button>
                <button
                  onClick={() => setKnowledgeSource('both')}
                  className={`px-2 py-0.5 rounded-md font-medium transition ${
                    knowledgeSource === 'both'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Query both current PDF and platform knowledge"
                >
                  Both
                </button>
              </>
            )}
          </div>

          {/* Exit PDF Chat */}
          {activeDocument && (
            <button
              onClick={exitPdfChatMode}
              className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
            >
              Exit PDF Chat
            </button>
          )}
        </div>
      </div>

      {/* 3. Document Tray Drawer (Collapsible) */}
      {showDocTray && (
        <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs animate-in slide-in-from-top-2 duration-150 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-900" />
              <span>Available RAG Documents</span>
            </span>
            <button
              onClick={() => setShowDocTray(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto">
            {documents.length === 0 ? (
              <div className="p-3 text-slate-400 text-center col-span-3">
                No documents uploaded yet. Click &quot;Upload PDF&quot; above to add learning materials.
              </div>
            ) : (
              documents.map((doc) => {
                const isActive = activeDocument?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => enterPdfChatMode(doc)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      isActive
                        ? 'bg-blue-50 border-blue-400 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="font-bold text-slate-800 truncate flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                        <span className="truncate">{doc.name}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteDocument(doc.id, e)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 shrink-0"
                        title="Delete document"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                      <span>{doc.totalPages} pages</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium font-sans">Indexed</span>
                    </div>
                    {doc.detectedTopics && doc.detectedTopics.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {doc.detectedTopics.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-1 py-0.2 rounded text-[9px] truncate max-w-[120px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4. Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-blue-900">
                <Brain className="w-4 h-4 text-amber-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-950 text-white shadow-xs rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs rounded-tl-none space-y-3'
              }`}
            >
              {/* Message Header Pill (Source indicator) */}
              {m.role === 'assistant' && m.sourceUsed && (
                <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 text-[10px] font-mono text-slate-400">
                  <Database className="w-3 h-3 text-blue-700" />
                  <span>
                    Knowledge Source:{' '}
                    <strong className="text-blue-900 font-semibold uppercase">
                      {m.sourceUsed === 'pdf'
                        ? 'Uploaded PDF'
                        : m.sourceUsed === 'both'
                        ? 'PDF + Platform'
                        : 'IMD Platform Knowledge'}
                    </strong>
                  </span>
                </div>
              )}

              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>

              {/* Citations block */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Source Citations:</span>
                  </div>
                  <div className="space-y-1.5">
                    {m.citations.map((c, i) => (
                      <div
                        key={i}
                        onClick={() => setInspectedCitation(c)}
                        className="p-2.5 bg-slate-50 hover:bg-blue-50/70 rounded-lg border border-slate-200 hover:border-blue-300 text-[11px] text-slate-600 space-y-0.5 cursor-pointer transition group"
                        title="Click to view full passage citation"
                      >
                        <div className="font-bold text-blue-900 flex items-center justify-between gap-1.5">
                          <span className="flex items-center gap-1 truncate">
                            <FileText className="w-3 h-3 text-blue-700 shrink-0" />
                            <span className="truncate">{c.sourceDocument}</span>
                            {c.pageNumber && (
                              <span className="bg-blue-100 text-blue-800 px-1 py-0.2 rounded text-[10px] font-mono shrink-0">
                                p. {c.pageNumber}
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-blue-700 group-hover:underline flex items-center gap-0.5 shrink-0">
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                        {c.sectionTitle && (
                          <div className="text-slate-400 font-normal text-[10px]">
                            {c.sectionTitle}
                          </div>
                        )}
                        <p className="text-slate-600 italic line-clamp-2">&ldquo;{c.snippet}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Followups */}
              {m.suggestedFollowups && m.suggestedFollowups.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-100">
                  {m.suggestedFollowups.map((f, fi) => (
                    <button
                      key={fi}
                      onClick={() => sendMessage(f)}
                      className="text-[11px] bg-blue-50/70 hover:bg-blue-100 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-full font-medium transition"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-slate-500 text-xs">
            <div className="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
              <span>
                {activeDocument
                  ? `Retrieving relevant chunks from "${activeDocument.name}" and verifying facts...`
                  : 'Retrieving syllabus resources & synthesizing grounded answer...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 5. Suggested Prompts Strip */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Suggested:
          </span>
          {currentSuggestedPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => sendMessage(item.prompt)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-900 rounded-full border border-slate-200 hover:border-blue-300 text-[11px] font-medium whitespace-nowrap transition shadow-2xs shrink-0 disabled:opacity-50"
              >
                <Icon className="w-3 h-3 text-blue-900" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            activeDocument
              ? `Ask a question about ${activeDocument.name} (e.g. orbits, Dvorak technique, formulas)...`
              : 'Ask MeghSetu AI about atmospheric thermodynamics, NWP models, radar, satellite imagery...'
          }
          className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 text-slate-800 placeholder-slate-400 transition"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary py-2.5 px-4 text-xs font-semibold rounded-xl"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>

      {/* 7. Upload PDF Modal */}
      {showUploadModal && (
        <div className="absolute inset-0 bg-blue-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-blue-950 to-blue-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm font-serif">Upload PDF for Grounded RAG Chat</h3>
              </div>
              <button
                onClick={() => {
                  if (!uploading) setShowUploadModal(false);
                }}
                disabled={uploading}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                  uploading
                    ? 'border-blue-300 bg-blue-50/50 cursor-wait'
                    : 'border-slate-300 hover:border-blue-600 bg-slate-50/50 hover:bg-blue-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-blue-900" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Click to select or drag & drop a PDF document
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Handbooks, training manuals, syllabi, or course notes (PDF up to 25MB)
                </p>
              </div>

              {/* Progress & Stages */}
              {uploading && (
                <div className="space-y-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-950">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-900" />
                      <span>{uploadStage}</span>
                    </span>
                    <span className="font-mono">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-900 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Error */}
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Quick Select Demo Document */}
              <div className="pt-2 border-t border-slate-200">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Or Chat With Sample Demonstration Material:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const demo = documents.find((d) => d.id === 'doc_satellite_meteorology_handbook');
                    if (demo) {
                      setShowUploadModal(false);
                      enterPdfChatMode(demo);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-left transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-900" />
                    <div>
                      <div className="text-xs font-bold text-blue-950">
                        Satellite Meteorology Handbook.pdf
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        86 pages • Pre-indexed • Dvorak, Orbits, Sounders
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-900 bg-white px-2 py-1 rounded-md border border-blue-200 shadow-2xs">
                    Open Demo PDF
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Citation Inspection Modal */}
      {inspectedCitation && (
        <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold text-xs truncate">
                  Citation: {inspectedCitation.sourceDocument}
                </span>
              </div>
              <button
                onClick={() => setInspectedCitation(null)}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-slate-600 font-mono text-[11px]">
                <span>Page Number: <strong>{inspectedCitation.pageNumber || 'General'}</strong></span>
                {inspectedCitation.score && (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                    Relevance: {inspectedCitation.score}%
                  </span>
                )}
              </div>
              {inspectedCitation.sectionTitle && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Section:
                  </span>
                  <p className="font-semibold text-blue-950 mt-0.5">
                    {inspectedCitation.sectionTitle}
                  </p>
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Extracted Passage:
                </span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-700 italic">
                  &ldquo;{inspectedCitation.snippet}&rdquo;
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setInspectedCitation(null)}
                  className="px-3 py-1.5 bg-blue-950 text-white rounded-lg text-xs font-semibold"
                >
                  Close Citation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
