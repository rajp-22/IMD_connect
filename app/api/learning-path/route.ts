import { NextResponse } from 'next/server';
import { getLearningPathByUserId, updateLearningPathStep } from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr_trainee_001';

    const path = await getLearningPathByUserId(userId);
    return NextResponse.json({ success: true, learningPath: path });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, stepId, status, score } = body;

    if (!userId || !stepId || !status) {
      return NextResponse.json(
        { error: 'userId, stepId, and status are required' },
        { status: 400 }
      );
    }

    const updated = await updateLearningPathStep(userId, stepId, status, score);
    return NextResponse.json({ success: true, learningPath: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
