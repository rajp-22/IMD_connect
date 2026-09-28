import { NextResponse } from 'next/server';
import { askCapacityAI } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, documentTitle, documentText, courseTitle, lessonTitle } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const aiResponse = await askCapacityAI({
      prompt,
      contextType: 'document_qa',
      mode: 'document_qa',
      documentTitle: documentTitle || 'IMD Course Reference Document',
      documentText,
      courseTitle,
      lessonTitle,
    });

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
