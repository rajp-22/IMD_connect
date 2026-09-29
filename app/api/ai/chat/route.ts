import { NextResponse } from 'next/server';
import { askCapacityAI } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prompt,
      contextType,
      mode,
      courseTitle,
      lessonTitle,
      lessonContent,
      traineeCompetencies,
      targetRole,
    } = body;

    const textPrompt = body.prompt || body.message;
    if (!textPrompt) {
      return NextResponse.json({ error: 'Prompt or message is required' }, { status: 400 });
    }

    // If RAG query with document or source filter
    if (body.documentId || body.sourceFilter || mode === 'rag') {
      const { answerRAGQuery } = await import('@/lib/rag');
      const ragResponse = await answerRAGQuery({
        query: textPrompt,
        sourceFilter: body.sourceFilter || (body.documentId ? 'pdf' : 'platform'),
        documentId: body.documentId,
        conversationHistory: body.conversationHistory || body.history || [],
      });

      return NextResponse.json({
        success: true,
        response: {
          message: ragResponse.answer,
          citations: ragResponse.citations.map((c) => ({
            sourceDocument: c.sourceDocument,
            sectionTitle: `${c.sectionTitle || 'Section'} (p. ${c.pageNumber})`,
            snippet: c.snippet,
          })),
          suggestedFollowups: ragResponse.suggestedFollowups,
          providerUsed: ragResponse.providerUsed,
        },
      });
    }

    const aiResponse = await askCapacityAI({
      prompt: textPrompt,
      contextType: contextType || 'general',
      mode: mode || 'chat',
      courseTitle,
      lessonTitle,
      lessonContent,
      traineeCompetencies,
      targetRole,
    });

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
