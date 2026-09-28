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
