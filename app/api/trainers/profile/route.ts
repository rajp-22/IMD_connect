import { NextResponse } from 'next/server';
import { getTrainerProfile, getAllTrainers } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const all = searchParams.get('all');

    if (all === 'true') {
      const trainers = await getAllTrainers();
      return NextResponse.json({ success: true, trainers });
    }

    const targetId = userId || (session?.role === 'trainer' ? session.id : 'usr_trainer_001');
    const profile = await getTrainerProfile(targetId);
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
