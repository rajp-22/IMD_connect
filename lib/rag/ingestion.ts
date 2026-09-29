import { IKnowledgeChunk } from './types';
import { generateEmbedding } from './embeddings';

// Maximum supported PDF size: 25MB
export const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024;
export const DEFAULT_CHUNK_SIZE = 700; // characters
export const DEFAULT_CHUNK_OVERLAP = 120; // characters

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedPdfResult {
  text: string;
  pages: ExtractedPage[];
  totalPages: number;
  isScannedOrImageOnly: boolean;
  detectedTopics: string[];
  overviewSummary: string;
}

/**
 * Validate that a buffer is an authentic PDF and within size limits.
 */
export function validatePdfBuffer(buffer: Buffer): { valid: boolean; error?: string } {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Empty file received. Please provide a valid PDF document.' };
  }

  if (buffer.length > MAX_PDF_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 25MB limit (received ${(buffer.length / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  // Check magic bytes %PDF-
  const header = buffer.subarray(0, 8).toString('ascii');
  if (!header.startsWith('%PDF-')) {
    return { valid: false, error: 'Invalid file format. The uploaded file does not have a valid PDF header.' };
  }

  return { valid: true };
}

/**
 * Clean and normalize text extracted from PDF
 */
export function cleanExtractedText(raw: string): string {
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove non-printable control characters
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ') // Collapse multiple inline spaces
    .replace(/\n{3,}/g, '\n\n') // Collapse excessive newlines
    .trim();
}

// Polyfill DOM globals required by PDF.js in Node.js runtime
if (typeof (globalThis as any).DOMMatrix === 'undefined') {
  (globalThis as any).DOMMatrix = class DOMMatrix {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
  };
}
if (typeof (globalThis as any).Path2D === 'undefined') {
  (globalThis as any).Path2D = class Path2D {};
}

/**
 * Fallback regex stream extractor for basic text streams in PDFs
 */
function extractRawPdfTextStreams(buffer: Buffer): string {
  const str = buffer.toString('latin1');
  const textChunks: string[] = [];

  // Match text in parenthesis (text) Tj or [(text)] TJ
  const matches = str.match(/\(([^()]*)\)\s*Tj/g);
  if (matches) {
    for (const m of matches) {
      const content = m.replace(/\)\s*Tj$/, '').replace(/^\(/, '');
      if (content.trim()) textChunks.push(content);
    }
  }

  // Also check TJ array strings
  const tjMatches = str.match(/\[(.*?)\]\s*TJ/g);
  if (tjMatches) {
    for (const m of tjMatches) {
      const innerMatches = m.match(/\(([^()]*)\)/g);
      if (innerMatches) {
        textChunks.push(innerMatches.map((im) => im.slice(1, -1)).join(' '));
      }
    }
  }

  return cleanExtractedText(textChunks.join(' '));
}

/**
 * Extract text and individual pages from a PDF buffer.
 * Uses unpdf as primary zero-dependency extractor with pdf-parse and stream fallbacks.
 */
export async function extractPdfText(buffer: Buffer): Promise<ExtractedPdfResult> {
  const validation = validatePdfBuffer(buffer);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid PDF buffer');
  }

  const pages: ExtractedPage[] = [];
  let fullText = '';
  let totalPages = 0;

  // 1. Primary Extractor: unpdf (works without worker thread issues in Next.js runtime)
  try {
    const { extractText } = require('unpdf');
    const unpdfResult = await extractText(new Uint8Array(buffer));
    if (unpdfResult && unpdfResult.text) {
      if (Array.isArray(unpdfResult.text) && unpdfResult.text.length > 0) {
        totalPages = unpdfResult.totalPages || unpdfResult.text.length;
        for (let i = 0; i < unpdfResult.text.length; i++) {
          const cleaned = cleanExtractedText(unpdfResult.text[i] || '');
          if (cleaned.length > 0) {
            pages.push({
              pageNumber: i + 1,
              text: cleaned,
            });
          }
        }
      } else if (typeof unpdfResult.text === 'string' && unpdfResult.text.trim().length > 0) {
        totalPages = unpdfResult.totalPages || 1;
        pages.push({ pageNumber: 1, text: cleanExtractedText(unpdfResult.text) });
      }
    }
  } catch (unpdfErr: any) {
    console.warn('unpdf extraction failed, attempting pdf-parse fallback:', unpdfErr?.message);
  }

  // 2. Secondary Fallback: pdf-parse
  if (pages.length === 0) {
    try {
      const pdfModule = require('pdf-parse');

      if (pdfModule.PDFParse) {
        const parser = new pdfModule.PDFParse({ data: buffer });
        await parser.load();
        totalPages = parser.doc?.numPages || 1;
        const textResult = await parser.getText();

        if (textResult && Array.isArray(textResult.pages) && textResult.pages.length > 0) {
          for (const p of textResult.pages) {
            const cleaned = cleanExtractedText(p.text || '');
            if (cleaned.length > 0) {
              pages.push({
                pageNumber: p.num || pages.length + 1,
                text: cleaned,
              });
            }
          }
        } else if (textResult?.text) {
          pages.push({
            pageNumber: 1,
            text: cleanExtractedText(textResult.text),
          });
        }
      } else if (typeof pdfModule === 'function') {
        const parsed = await pdfModule(buffer);
        totalPages = parsed.numpages || 1;
        const cleaned = cleanExtractedText(parsed.text || '');
        if (cleaned.length > 0) {
          pages.push({ pageNumber: 1, text: cleaned });
        }
      }
    } catch (pdfParseErr: any) {
      console.warn('pdf-parse extraction failed, attempting raw stream fallback:', pdfParseErr?.message);
      const rawFallback = extractRawPdfTextStreams(buffer);
      if (rawFallback && rawFallback.length > 10) {
        totalPages = 1;
        pages.push({ pageNumber: 1, text: rawFallback });
      }
    }
  }

  // Calculate full aggregated text
  fullText = pages.map((p) => p.text).join('\n\n');
  if (totalPages === 0) totalPages = Math.max(1, pages.length);

  // Check for scanned / image-only PDF
  const totalWords = fullText.split(/\s+/).filter((w) => w.length > 2).length;
  const isScannedOrImageOnly = totalPages >= 2 && totalWords < 40;

  // Extract detected topics & summary
  const detectedTopics = extractDocumentTopics(fullText);
  const overviewSummary = generateDocumentOverview(fullText, totalPages, detectedTopics);

  return {
    text: fullText,
    pages,
    totalPages,
    isScannedOrImageOnly,
    detectedTopics,
    overviewSummary,
  };
}

/**
 * Extract realistic topics directly from the document content without hallucinations.
 */
export function extractDocumentTopics(text: string): string[] {
  const lower = text.toLowerCase();
  const candidates = [
    { name: 'Rainfall Summary & Monsoon Departures', matches: ['rainfall summary', 'monsoon period', 'departure', 'district', 'actual (mm)', 'normal (mm)', 'rainfall'] },
    { name: 'Weather Observations & Stations', matches: ['station directory', 'daily weather observations', 'temperature', 'humidity', 'wind speed', 'pressure hpa', 'elevation'] },
    { name: 'Weather Warnings & Advisories', matches: ['weather warning', 'hazard', 'severity', 'advisory', 'heavy rain', 'orange', 'yellow', 'red', 'thunderstorm'] },
    { name: 'Seven-Day Weather Forecasts', matches: ['forecast', 'seven-day forecast', 'rain prob', 'weather forecast'] },
    { name: 'Satellite Orbits & Navigation', matches: ['orbit', 'geostationary', 'polar orbit', 'sun-synchronous', 'apogee', 'perigee'] },
    { name: 'Remote Sensing & Radiometry', matches: ['remote sensing', 'radiometer', 'spectral', 'radiance', 'insat-3dr', 'payload'] },
    { name: 'Infrared & Visible Imagery', matches: ['infrared imagery', 'tir1', 'water vapor channel', 'visible channel', 'albedo'] },
    { name: 'Tropical Cyclones & Dvorak Technique', matches: ['dvorak', 'tropical cyclone', 't-number', 'central dense overcast', 'eye pattern'] },
    { name: 'Numerical Weather Prediction (NWP)', matches: ['numerical weather prediction', 'nwp', 'ncum', 'wrf', 'primitive equations', 'grid resolution'] },
    { name: 'Atmospheric Thermodynamics', matches: ['tephigram', 'thermodynamic', 'cape', 'cin', 'lapse rate', 'sounding', 'radiosonde'] },
    { name: 'Radar Meteorology & Nowcasting', matches: ['radar', 'doppler', 'dwr', 'reflectivity', 'z-r', 'nowcasting', 'radial velocity'] },
    { name: 'Automatic Weather Stations (AWS)', matches: ['automatic weather station', 'aws', 'tipping bucket', 'pt100', 'barometer', 'telemetry'] },
    { name: 'Synoptic Weather Forecasting', matches: ['synoptic', 'monsoon trough', 'western disturbance', 'isobar', 'pressure system'] },
  ];

  const detected: string[] = [];
  for (const c of candidates) {
    const score = c.matches.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
    if (score >= 1) {
      detected.push(c.name);
    }
  }

  // Fallback to headers or default
  if (detected.length === 0) {
    detected.push('Meteorological Principles', 'Operational Guidelines');
  }

  return detected.slice(0, 5);
}


/**
 * Generate a concise, factual overview from the document's initial pages
 */
function generateDocumentOverview(text: string, totalPages: number, topics: string[]): string {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 50 && !p.startsWith('#'));

  const lead = paragraphs.slice(0, 2).join(' ').slice(0, 280);
  return lead.length > 0
    ? `${lead}...`
    : `Technical meteorological documentation spanning ${totalPages} pages covering ${topics.join(', ')}.`;
}

/**
 * Split document pages into indexed semantic chunks with complete metadata.
 */
export async function chunkDocument(params: {
  documentId: string;
  documentName: string;
  pages: ExtractedPage[];
  uploadedBy: string;
  uploaderRole: string;
  documentType: string;
  courseId?: string;
  lessonId?: string;
  chunkSize?: number;
  chunkOverlap?: number;
}): Promise<IKnowledgeChunk[]> {
  const {
    documentId,
    documentName,
    pages,
    uploadedBy,
    documentType,
    courseId,
    lessonId,
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunkOverlap = DEFAULT_CHUNK_OVERLAP,
  } = params;

  const chunks: IKnowledgeChunk[] = [];
  const uploadDate = new Date().toISOString();

  let chunkCounter = 1;

  for (const page of pages) {
    const pageNumber = page.pageNumber;
    const pageText = page.text.trim();

    if (pageText.length === 0) continue;

    // Check for section title on this page (e.g. lines starting with "Chapter", "Section", "1.", all-caps titles)
    const lines = pageText.split('\n').map((l) => l.trim()).filter(Boolean);
    let sectionTitle = `Page ${pageNumber}`;
    for (const l of lines.slice(0, 5)) {
      if (/^(Chapter|Section|\d+\.|\bMODULE\b|\bPART\b)/i.test(l) && l.length < 80) {
        sectionTitle = l;
        break;
      }
    }

    // Split text into sliding chunks
    if (pageText.length <= chunkSize) {
      const chunkContent = pageText;
      const embedding = await generateEmbedding(chunkContent);

      chunks.push({
        id: `${documentId}_c${chunkCounter++}`,
        documentId,
        documentName,
        pageNumber,
        sectionTitle,
        courseId,
        lessonId,
        uploadedBy,
        documentType,
        uploadDate,
        content: chunkContent,
        tokenCount: Math.ceil(chunkContent.length / 4),
        embedding,
      });
    } else {
      let startIdx = 0;
      while (startIdx < pageText.length) {
        let endIdx = Math.min(startIdx + chunkSize, pageText.length);

        // Try not to cut words in half
        if (endIdx < pageText.length) {
          const spaceIdx = pageText.lastIndexOf(' ', endIdx);
          if (spaceIdx > startIdx + (chunkSize * 0.7)) {
            endIdx = spaceIdx;
          }
        }

        const chunkContent = pageText.slice(startIdx, endIdx).trim();

        if (chunkContent.length > 40) {
          const embedding = await generateEmbedding(chunkContent);

          chunks.push({
            id: `${documentId}_c${chunkCounter++}`,
            documentId,
            documentName,
            pageNumber,
            sectionTitle,
            courseId,
            lessonId,
            uploadedBy,
            documentType,
            uploadDate,
            content: chunkContent,
            tokenCount: Math.ceil(chunkContent.length / 4),
            embedding,
          });
        }

        if (endIdx >= pageText.length) break;
        startIdx = Math.max(startIdx + 1, endIdx - chunkOverlap);
      }
    }
  }

  return chunks;
}
