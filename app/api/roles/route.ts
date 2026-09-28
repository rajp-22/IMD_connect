import { NextResponse } from 'next/server';
import { getRoleTemplates, compareTraineeToRole } from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const traineeId = searchParams.get('traineeId');
    const roleCode = searchParams.get('roleCode') || 'WF-CORE';

    if (traineeId) {
      const comparison = await compareTraineeToRole(traineeId, roleCode);
      return NextResponse.json({ success: true, comparison });
    }

    const roles = await getRoleTemplates();
    return NextResponse.json({ success: true, roles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
