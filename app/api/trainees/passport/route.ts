import { NextResponse } from 'next/server';
import { getCompetencyPassport } from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const traineeId = searchParams.get('traineeId') || 'usr_trainee_001';

    const passport = await getCompetencyPassport(traineeId);
    if (!passport) {
      return NextResponse.json({ error: 'Passport not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, passport });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
