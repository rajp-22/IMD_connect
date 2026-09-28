import { NextResponse } from 'next/server';
import { getCompetencies, getTraineeCompetencies } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const traineeId =
      searchParams.get('traineeId') ||
      (session?.role === 'trainee' ? session.id : 'usr_trainee_001');

    const competencies = await getCompetencies();
    const traineeCompetencies = await getTraineeCompetencies(traineeId);

    return NextResponse.json({
      success: true,
      competencies,
      traineeCompetencies,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
