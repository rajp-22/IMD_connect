import { NextResponse } from 'next/server';
import { getAdminDashboardMetrics } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access. Administrative role required.' },
        { status: 403 }
      );
    }

    const metrics = await getAdminDashboardMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
