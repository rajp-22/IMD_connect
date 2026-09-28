import { NextResponse } from 'next/server';
import { getCertificates } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const traineeId =
      session.role === 'trainee'
        ? session.id
        : searchParams.get('traineeId') || undefined;

    const certificates = await getCertificates(traineeId);
    return NextResponse.json({ success: true, certificates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
