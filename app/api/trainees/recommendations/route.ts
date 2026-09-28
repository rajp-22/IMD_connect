import { NextResponse } from 'next/server';
import { getSmartCourseRecommendations } from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const traineeId = searchParams.get('traineeId') || 'usr_trainee_001';

    const recommendations = await getSmartCourseRecommendations(traineeId);
    return NextResponse.json({ success: true, recommendations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
