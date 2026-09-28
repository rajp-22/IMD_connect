import { NextResponse } from 'next/server';
import { getTrainingImpactAnalytics } from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId') || undefined;
    const department = searchParams.get('department') || undefined;
    const role = searchParams.get('role') || undefined;
    const timePeriod = searchParams.get('timePeriod') || undefined;

    const metrics = await getTrainingImpactAnalytics({
      courseId,
      department,
      role,
      timePeriod,
    });

    return NextResponse.json({ success: true, metrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
