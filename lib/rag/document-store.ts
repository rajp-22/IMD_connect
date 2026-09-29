import fs from 'fs';
import path from 'path';
import { IRAGDocument, IKnowledgeChunk, DocumentProcessingStatus, KnowledgeSourceType } from './types';
import { getPreIndexedPlatformChunks, PLATFORM_KNOWLEDGE_DOCUMENTS } from './knowledge-base';
import { generateLocalSemanticEmbedding } from './embeddings';

interface RAGStoreData {
  documents: IRAGDocument[];
  chunks: IKnowledgeChunk[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const RAG_STORE_PATH = path.join(DATA_DIR, 'rag-store.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Pre-seeded demonstration PDF document: "Satellite Meteorology Handbook.pdf"
 * Designed to satisfy DEMO 2 & DEMO 3 out of the box.
 */
function getPreSeededDemoDocument(): { doc: IRAGDocument; chunks: IKnowledgeChunk[] } {
  const docId = 'doc_satellite_meteorology_handbook';
  const docName = 'Satellite Meteorology Handbook.pdf';
  const uploadDate = '2026-02-15T10:00:00.000Z';

  const doc: IRAGDocument = {
    id: docId,
    name: docName,
    originalFileName: docName,
    fileSize: 4820350,
    totalPages: 86,
    status: 'READY',
    statusMessage: 'Ready for AI Chat',
    uploadedBy: 'usr_trainee_001',
    uploaderRole: 'trainee',
    uploaderName: 'Pooja Iyer',
    uploadDate,
    documentType: 'pdf',
    detectedTopics: [
      'Satellite Orbits',
      'Remote Sensing & Radiometry',
      'Infrared & Visible Imagery',
      'Tropical Cyclones & Dvorak Technique',
    ],
    overviewSummary:
      'Comprehensive meteorological operational handbook detailing satellite orbital dynamics, INSAT-3DR multi-spectral radiometer channels, thermal infrared sounder interpretation, and tropical cyclone intensity estimation using the Dvorak technique.',
    isScannedOrImageOnly: false,
    totalChunks: 5,
  };

  const rawChunks = [
    {
      pageNumber: 12,
      sectionTitle: 'Chapter 2: Principles of Meteorological Satellite Orbits',
      content:
        'Meteorological satellites primarily operate in two distinct orbital configurations:\n1. Geostationary Earth Orbit (GEO): Situated at approximately 35,786 km above the equator with an orbital period matching Earth\'s rotation (24 hours). Satellites remain stationary relative to a fixed sub-satellite point, providing high-temporal resolution (every 15 to 30 minutes) synoptic monitoring of weather systems and tropical cyclone lifecycles. Examples include India\'s INSAT-3D and INSAT-3DR located at 82°E and 74°E longitude.\n2. Low Earth Polar Sun-Synchronous Orbit (LEO / LPO): Situated at altitudes between 700 km and 850 km with orbital inclinations around 98 degrees. These satellites pass over each latitude at nearly the same local solar time twice daily, delivering superior spatial resolution and global coverage ideal for hyperspectral atmospheric soundings and numerical model assimilation.',
    },
    {
      pageNumber: 24,
      sectionTitle: 'Chapter 3: Spectral Channels of INSAT-3DR Imager Payload',
      content:
        'The INSAT-3DR meteorological payload features a six-channel multi-spectral Imager:\n1. Visible Channel (0.55 – 0.75 µm, 1 km resolution): Measures reflected solar irradiance for daytime cloud albedo, fog detection, and aerosol optical depth.\n2. Shortwave Infrared (SWIR, 1.55 – 1.70 µm, 1 km resolution): Excellent for daytime snow vs cloud discrimination and bushfire detection.\n3. Mid-Infrared (MIR, 3.80 – 4.00 µm, 4 km resolution): Highly sensitive to hot land surfaces, sea surface temperatures (SST), and nighttime low stratus cloud tracking.\n4. Water Vapor Channel (WV, 6.50 – 7.10 µm, 8 km resolution): Absorbs strongly in upper tropospheric moisture layers (500–200 hPa) mapping jet streams, upper-level vorticity, and dry conveyor belts.\n5. Thermal Infrared 1 (TIR-1, 10.3 – 11.3 µm, 4 km resolution) & Thermal Infrared 2 (TIR-2, 11.5 – 12.5 µm, 4 km resolution): Split-window channels measuring cloud-top temperatures and surface brightness temperature with atmospheric moisture correction.',
    },
    {
      pageNumber: 39,
      sectionTitle: 'Chapter 4.4: Dvorak Technique for Tropical Cyclone Intensity',
      content:
        'The Dvorak technique utilizes enhanced thermal infrared (EIR) curves to measure the temperature contrast between the warm eye and the surrounding cold convective cloud canopy (the Central Dense Overcast or CDO).\n- Eye Pattern: The intensity index (T-number) increases when the eye temperature is warm (e.g. > +10°C) and completely surrounded by cold cloud tops (e.g. < -70°C or colder shaded white/pink).\n- Curved Band Pattern: Used in early developmental stages (T1.0 to T3.5) where the degree of curvature of convective spiral bands wrapping around the low-level circulation center defines the Data T-number (DT).\n- Current Intensity (CI) Scale: T-numbers map from T1.0 to T8.0. A CI of 4.5 corresponds to sustained winds of 77 knots (Severe Cyclonic Storm in North Indian Ocean).',
    },
    {
      pageNumber: 58,
      sectionTitle: 'Chapter 6: Atmospheric Sounder Retrievals & Stability Indices',
      content:
        'The 19-channel infrared Sounder on INSAT-3DR retrieves vertical temperature and humidity profiles across 40 pressure layers from 1000 hPa to 10 hPa. Key derived diagnostic products generated operationally every hour over the Indian landmass and adjoining ocean basins include:\n- Total Precipitable Water (TPW in mm)\n- Lifted Index (LI)\n- Layer Precipitable Water (LPW in low, mid, and high levels)\n- Maximum Potential Intensity (MPI) for cyclonic disturbances.',
    },
    {
      pageNumber: 71,
      sectionTitle: 'Chapter 8: Nighttime Fog and Low Cloud Detection Techniques',
      content:
        'Nighttime fog detection relies on the brightness temperature difference (BTD) between the 3.9 µm shortwave infrared and 10.8 µm thermal infrared channels: BTD = T_3.9 - T_10.8. Because water droplet clouds (such as radiation fog over the Indo-Gangetic Plains during winter) have lower emissivity in the 3.9 µm channel than at 10.8 µm, the BTD yields significant negative values (-2 K to -6 K). This allows automated demarcation of dense fog boundaries even in total darkness when visible imagery is unavailable.',
    },
  ];

  const chunks: IKnowledgeChunk[] = rawChunks.map((c, i) => ({
    id: `${docId}_c${i + 1}`,
    documentId: docId,
    documentName: docName,
    pageNumber: c.pageNumber,
    sectionTitle: c.sectionTitle,
    uploadedBy: 'usr_trainee_001',
    documentType: 'pdf',
    uploadDate,
    content: c.content,
    tokenCount: Math.ceil(c.content.length / 4),
    embedding: generateLocalSemanticEmbedding(c.content),
  }));

  return { doc, chunks };
}

/**
 * Load all RAG documents and chunks from JSON storage.
 */
export function loadRAGStore(): RAGStoreData {
  ensureDataDir();

  if (fs.existsSync(RAG_STORE_PATH)) {
    try {
      const content = fs.readFileSync(RAG_STORE_PATH, 'utf-8');
      const data: RAGStoreData = JSON.parse(content);

      // Verify demo document exists
      const hasDemoDoc = data.documents.some((d) => d.id === 'doc_satellite_meteorology_handbook');
      if (!hasDemoDoc) {
        const demo = getPreSeededDemoDocument();
        data.documents.push(demo.doc);
        data.chunks.push(...demo.chunks);
        saveRAGStore(data);
      }

      return data;
    } catch (e) {
      console.error('Error reading rag-store.json, reinitializing:', e);
    }
  }

  // Initialize with pre-seeded demo document
  const demo = getPreSeededDemoDocument();
  const initialStore: RAGStoreData = {
    documents: [demo.doc],
    chunks: [...demo.chunks],
  };

  saveRAGStore(initialStore);
  return initialStore;
}

/**
 * Save store back to disk
 */
export function saveRAGStore(store: RAGStoreData): void {
  ensureDataDir();
  fs.writeFileSync(RAG_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

/**
 * Save or update a document and its chunks
 */
export async function saveRAGDocument(doc: IRAGDocument, chunks: IKnowledgeChunk[]): Promise<void> {
  const store = loadRAGStore();
  const existingDocIdx = store.documents.findIndex((d) => d.id === doc.id);

  if (existingDocIdx >= 0) {
    store.documents[existingDocIdx] = doc;
    // Replace chunks for this document
    store.chunks = store.chunks.filter((c) => c.documentId !== doc.id);
  } else {
    store.documents.unshift(doc);
  }

  store.chunks.push(...chunks);
  saveRAGStore(store);
}

/**
 * Update document status
 */
export function updateDocumentStatus(
  docId: string,
  status: DocumentProcessingStatus,
  statusMessage?: string,
  errorMessage?: string
): void {
  const store = loadRAGStore();
  const doc = store.documents.find((d) => d.id === docId);
  if (doc) {
    doc.status = status;
    if (statusMessage) doc.statusMessage = statusMessage;
    if (errorMessage) doc.errorMessage = errorMessage;
    saveRAGStore(store);
  }
}

/**
 * Get document by ID
 */
export function getRAGDocumentById(id: string): IRAGDocument | null {
  const store = loadRAGStore();
  return store.documents.find((d) => d.id === id) || null;
}

/**
 * Get documents accessible to a user based on role and permissions.
 */
export function getUserRAGDocuments(userId?: string, userRole?: string): IRAGDocument[] {
  const store = loadRAGStore();

  if (!userId) {
    return store.documents.filter((d) => d.uploadedBy === 'usr_trainee_001');
  }

  // Admin has access to all documents
  if (userRole === 'admin') {
    return store.documents;
  }

  // Trainer has access to course/lesson materials and their own
  if (userRole === 'trainer') {
    return store.documents.filter(
      (d) => d.uploadedBy === userId || d.documentType !== 'pdf' || d.uploadedBy === 'usr_trainee_001'
    );
  }

  // Trainee: can access demo document + documents they uploaded themselves
  return store.documents.filter(
    (d) => d.uploadedBy === userId || d.id === 'doc_satellite_meteorology_handbook'
  );
}

/**
 * Delete a document and its indexed chunks.
 */
export function deleteRAGDocument(docId: string, userId?: string, userRole?: string): boolean {
  const store = loadRAGStore();
  const docIdx = store.documents.findIndex((d) => d.id === docId);
  if (docIdx === -1) return false;

  const doc = store.documents[docIdx];
  // Check authorization
  if (userRole !== 'admin' && userId && doc.uploadedBy !== userId) {
    return false;
  }

  store.documents.splice(docIdx, 1);
  store.chunks = store.chunks.filter((c) => c.documentId !== docId);
  saveRAGStore(store);
  return true;
}

/**
 * Get all candidate chunks for retrieval based on source filter, documentId, and user authorization.
 */
export function getAllCandidateChunks(params: {
  sourceFilter: KnowledgeSourceType;
  documentId?: string;
  userId?: string;
  userRole?: string;
}): IKnowledgeChunk[] {
  const { sourceFilter, documentId, userId, userRole } = params;
  const store = loadRAGStore();

  const platformChunks = getPreIndexedPlatformChunks();
  const userDocs = getUserRAGDocuments(userId, userRole);
  const authorizedDocIds = new Set(userDocs.map((d) => d.id));

  // If specific documentId is selected for PDF chat:
  if (documentId) {
    const docChunks = store.chunks.filter((c) => c.documentId === documentId);
    if (sourceFilter === 'pdf') {
      return docChunks;
    }
    if (sourceFilter === 'both') {
      return [...docChunks, ...platformChunks];
    }
  }

  if (sourceFilter === 'platform') {
    return platformChunks;
  }

  if (sourceFilter === 'pdf') {
    return store.chunks.filter((c) => authorizedDocIds.has(c.documentId));
  }

  // 'both'
  const accessiblePdfChunks = store.chunks.filter((c) => authorizedDocIds.has(c.documentId));
  return [...accessiblePdfChunks, ...platformChunks];
}
