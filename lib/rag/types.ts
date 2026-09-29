export type DocumentProcessingStatus = 'UPLOADING' | 'PROCESSING' | 'INDEXING' | 'READY' | 'FAILED';

export type KnowledgeSourceType = 'platform' | 'pdf' | 'both';

export interface IRAGDocument {
  id: string;
  name: string;
  originalFileName: string;
  fileSize: number;
  totalPages: number;
  status: DocumentProcessingStatus;
  statusMessage?: string;
  errorMessage?: string;
  uploadedBy: string; // userId
  uploaderRole: 'trainee' | 'trainer' | 'admin';
  uploaderName?: string;
  uploadDate: string;
  documentType: 'pdf' | 'platform_handbook' | 'syllabus' | 'manual';
  courseId?: string;
  lessonId?: string;
  detectedTopics: string[];
  overviewSummary?: string;
  isScannedOrImageOnly?: boolean;
  totalChunks: number;
}

export interface IKnowledgeChunk {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber: number;
  sectionTitle?: string;
  courseId?: string;
  lessonId?: string;
  uploadedBy: string;
  documentType: string;
  uploadDate: string;
  content: string;
  tokenCount?: number;
  embedding?: number[];
  vectorNorm?: number;
}

export interface IRetrievalResult {
  chunk: IKnowledgeChunk;
  score: number; // 0.0 to 1.0 (cosine similarity or TF-IDF relevance)
  sourceType: 'platform' | 'pdf';
}

export interface IRAGQueryOptions {
  query: string;
  sourceFilter: KnowledgeSourceType;
  documentId?: string;
  userId?: string;
  userRole?: 'trainee' | 'trainer' | 'admin';
  topK?: number;
  similarityThreshold?: number;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export interface IRAGCitation {
  sourceDocument: string;
  documentId: string;
  pageNumber: number;
  sectionTitle?: string;
  snippet: string;
  score: number;
}

export interface IRAGAnswer {
  answer: string;
  citations: IRAGCitation[];
  detectedTopics?: string[];
  sourceUsed: KnowledgeSourceType;
  grounded: boolean;
  suggestedFollowups: string[];
  providerUsed: 'gemini' | 'openai' | 'imd-meteorology-rag-engine';
  confidenceScore?: number;
}
