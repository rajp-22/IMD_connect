/**
 * MeghSetu Grounded RAG (Retrieval-Augmented Generation) & PDF Intelligence Engine
 */

export * from './types';
export * from './embeddings';
export * from './ingestion';
export * from './knowledge-base';
export * from './document-store';
export * from './retrieval';
export * from './generation';

import {
  IRAGDocument,
  IKnowledgeChunk,
  IRAGQueryOptions,
  IRAGAnswer,
} from './types';
import { extractPdfText, chunkDocument } from './ingestion';
import { saveRAGDocument, updateDocumentStatus, getRAGDocumentById } from './document-store';
import { retrieveRelevantChunks } from './retrieval';
import { generateGroundedAnswer } from './generation';

/**
 * Reusable Document Ingestion Pipeline.
 * PDF -> Extract Text -> Clean -> Chunk -> Generate Embeddings -> Index in Store
 */
export async function ingestDocument(params: {
  buffer: Buffer;
  originalFileName: string;
  uploadedBy: string;
  uploaderRole: 'trainee' | 'trainer' | 'admin';
  uploaderName?: string;
  courseId?: string;
  lessonId?: string;
}): Promise<IRAGDocument> {
  const { buffer, originalFileName, uploadedBy, uploaderRole, uploaderName, courseId, lessonId } = params;

  const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const uploadDate = new Date().toISOString();

  // 1. Initial State: UPLOADING
  const docRecord: IRAGDocument = {
    id: docId,
    name: originalFileName,
    originalFileName,
    fileSize: buffer.length,
    totalPages: 0,
    status: 'PROCESSING',
    statusMessage: 'Reading document and extracting content...',
    uploadedBy,
    uploaderRole,
    uploaderName,
    uploadDate,
    documentType: 'pdf',
    courseId,
    lessonId,
    detectedTopics: [],
    totalChunks: 0,
  };

  try {
    // 2. State: PROCESSING -> Extract text & pages
    const extracted = await extractPdfText(buffer);

    docRecord.totalPages = extracted.totalPages;
    docRecord.detectedTopics = extracted.detectedTopics;
    docRecord.overviewSummary = extracted.overviewSummary;
    docRecord.isScannedOrImageOnly = extracted.isScannedOrImageOnly;

    if (extracted.isScannedOrImageOnly) {
      docRecord.statusMessage =
        'This PDF appears to contain scanned/image-based pages. Text-based AI chat may require OCR.';
    } else {
      docRecord.status = 'INDEXING';
      docRecord.statusMessage = 'Splitting content into semantic chunks and generating vector embeddings...';
    }

    // 3. State: INDEXING -> Split into chunks with embeddings
    const chunks = await chunkDocument({
      documentId: docId,
      documentName: originalFileName,
      pages: extracted.pages,
      uploadedBy,
      uploaderRole,
      documentType: 'pdf',
      courseId,
      lessonId,
    });

    docRecord.totalChunks = chunks.length;
    docRecord.status = 'READY';
    docRecord.statusMessage = 'Ready for AI Chat';

    // 4. Save to persistent RAG store
    await saveRAGDocument(docRecord, chunks);

    return docRecord;
  } catch (err: any) {
    docRecord.status = 'FAILED';
    docRecord.errorMessage = err.message || 'Unable to process this document. Please try again.';
    docRecord.statusMessage = 'Failed to index document';
    await saveRAGDocument(docRecord, []);
    throw err;
  }
}

/**
 * End-to-end RAG Query Processor.
 * Query -> Contextual Retrieval -> Factual Grounding -> Grounded Answer + Citations
 */
export async function answerRAGQuery(options: IRAGQueryOptions): Promise<IRAGAnswer> {
  const activeDoc = options.documentId ? getRAGDocumentById(options.documentId) : null;

  // 1. Semantic retrieval of top relevant chunks
  const retrievedChunks = await retrieveRelevantChunks(options);

  // 2. Synthesize grounded answer
  const answer = await generateGroundedAnswer({
    query: options.query,
    chunks: retrievedChunks,
    sourceFilter: options.sourceFilter,
    documentId: options.documentId,
    activeDocumentName: activeDoc?.name,
    conversationHistory: options.conversationHistory,
  });

  return answer;
}
