import { IRAGQueryOptions, IRetrievalResult, IKnowledgeChunk } from './types';
import { generateEmbedding, cosineSimilarity, tokenizeText } from './embeddings';
import { getAllCandidateChunks } from './document-store';

export const DEFAULT_TOP_K = 4;
export const DEFAULT_SIMILARITY_THRESHOLD = 0.18;

/**
 * Retrieve the most semantically relevant knowledge chunks for a query.
 * Considers user query, conversation follow-up context, source filters, and authorization.
 */
export async function retrieveRelevantChunks(options: IRAGQueryOptions): Promise<IRetrievalResult[]> {
  const {
    query,
    sourceFilter = 'platform',
    documentId,
    userId,
    userRole,
    topK = DEFAULT_TOP_K,
    similarityThreshold = DEFAULT_SIMILARITY_THRESHOLD,
    conversationHistory,
  } = options;

  if (!query || query.trim().length === 0) {
    return [];
  }

  // 1. Get all authorized candidate chunks based on filters
  const candidateChunks = getAllCandidateChunks({
    sourceFilter,
    documentId,
    userId,
    userRole,
  });

  if (candidateChunks.length === 0) {
    return [];
  }

  // Check if query is an overall document summary or topics request (not a specific section inquiry like "District Rainfall Summary")
  const lowerQuery = query.toLowerCase().trim();
  const isSpecificSectionInquiry =
    lowerQuery.includes('district') ||
    lowerQuery.includes('rainfall') ||
    lowerQuery.includes('station') ||
    lowerQuery.includes('temperature') ||
    lowerQuery.includes('warning') ||
    lowerQuery.includes('forecast') ||
    lowerQuery.includes('pune') ||
    lowerQuery.includes('mumbai') ||
    lowerQuery.includes('orbit');

  const isMetaSummaryQuery =
    !isSpecificSectionInquiry &&
    (lowerQuery.includes('summarize this') ||
      lowerQuery.includes('summarize the document') ||
      lowerQuery.includes('summarize document') ||
      lowerQuery.includes('summarize this pdf') ||
      lowerQuery === 'summarize' ||
      lowerQuery === 'summary' ||
      lowerQuery.includes('document summary') ||
      lowerQuery.includes('key topic') ||
      lowerQuery.includes('topics in this') ||
      lowerQuery.includes('what are the topics') ||
      lowerQuery.includes('study from') ||
      lowerQuery.includes('what should i study') ||
      lowerQuery.includes('overview') ||
      lowerQuery.includes('what is this document') ||
      lowerQuery.includes('about this document'));

  // If user asks for an overview, summary, or study guide of the active PDF, return leading document chunks
  if (isMetaSummaryQuery && sourceFilter === 'pdf' && candidateChunks.length > 0) {
    return candidateChunks.slice(0, topK).map((chunk, idx) => ({
      chunk,
      score: 0.95 - idx * 0.05,
      sourceType: 'pdf',
    }));
  }

  // 2. Formulate enriched search query with follow-up contextual awareness
  let enrichedQuery = query.trim();
  if (conversationHistory && conversationHistory.length > 0) {
    // Check if the query is a follow-up pronoun or brief inquiry
    const lower = query.toLowerCase();
    const isFollowup =
      lower.startsWith('its ') ||
      lower.startsWith('their ') ||
      lower.startsWith('how about ') ||
      lower.startsWith('what about ') ||
      lower.startsWith('why is that') ||
      lower.includes('limitations') ||
      lower.includes('explain more') ||
      query.split(/\s+/).length <= 4;

    if (isFollowup) {
      // Extract the last user question or key assistant topic
      const lastUserMsg = [...conversationHistory].reverse().find((m) => m.role === 'user');
      if (lastUserMsg) {
        enrichedQuery = `${query} (Context: ${lastUserMsg.content})`;
      }
    }
  }

  // 3. Generate query vector embedding
  const queryEmbedding = await generateEmbedding(enrichedQuery);

  // 4. Score all candidate chunks using Cosine Similarity
  const scoredResults: IRetrievalResult[] = [];

  for (const chunk of candidateChunks) {
    // If chunk doesn't have an embedding yet, generate on the fly
    const chunkVector = chunk.embedding && chunk.embedding.length > 0
      ? chunk.embedding
      : await generateEmbedding(chunk.content);

    const cosScore = cosineSimilarity(queryEmbedding, chunkVector);

    // Lexical verification: check how many substantive query tokens appear in chunk or section title
    const queryTokens = tokenizeText(query);
    const chunkLower = (chunk.content + ' ' + (chunk.sectionTitle || '')).toLowerCase();

    let matchedTokens = 0;
    for (const token of queryTokens) {
      if (chunkLower.includes(token)) {
        matchedTokens++;
      }
    }

    const lexicalRatio = queryTokens.length > 0 ? matchedTokens / queryTokens.length : 0;

    // Zero-evidence check: if query has substantive keywords but none appear in the text
    if (queryTokens.length > 0 && matchedTokens === 0) {
      continue;
    }

    // Hybrid score: weighted combination of semantic vector similarity and lexical token coverage
    const hybridScore = queryTokens.length > 0
      ? 0.45 * cosScore + 0.55 * lexicalRatio
      : cosScore;

    const isPlatform = chunk.documentType === 'platform_handbook' || chunk.documentId.startsWith('plat_');
    const sourceType: 'platform' | 'pdf' = isPlatform ? 'platform' : 'pdf';

    if (hybridScore >= similarityThreshold) {
      scoredResults.push({
        chunk,
        score: hybridScore,
        sourceType,
      });
    }
  }

  // 5. Sort descending by score and pick top-K
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.slice(0, topK);
}
