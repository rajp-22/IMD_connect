import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { answerRAGQuery, KnowledgeSourceType } from '@/lib/rag';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();

    const query = body.query || body.prompt || body.message;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query or prompt is required.' }, { status: 400 });
    }

    const sourceFilter: KnowledgeSourceType = body.sourceFilter || (body.documentId ? 'pdf' : 'platform');
    const documentId: string | undefined = body.documentId;
    const conversationHistory = body.conversationHistory || body.history || [];

    const answer = await answerRAGQuery({
      query: query.trim(),
      sourceFilter,
      documentId,
      userId: session?.id,
      userRole: session?.role,
      conversationHistory,
    });

    return NextResponse.json({
      success: true,
      response: answer,
    });
  } catch (error: any) {
    console.error('RAG query error:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred while answering your query through RAG.' },
      { status: 500 }
    );
  }
}
