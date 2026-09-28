import { NextResponse } from 'next/server';
import { getSkillGaps } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const traineeId =
      searchParams.get('traineeId') ||
      (session?.role === 'trainee' ? session.id : 'usr_trainee_001');

    const skillGaps = await getSkillGaps(traineeId);

    return NextResponse.json({
      success: true,
      skillGaps,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
