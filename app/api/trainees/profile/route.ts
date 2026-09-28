import { NextResponse } from 'next/server';
import { getTraineeProfile, updateTraineeProfile } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const userId =
      searchParams.get('userId') ||
      (session?.role === 'trainee' ? session.id : 'usr_trainee_001');

    const profile = await getTraineeProfile(userId);
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const updated = await updateTraineeProfile(session.id, body);
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
