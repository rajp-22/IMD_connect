import { NextResponse } from 'next/server';
import { getDepartmentSkillHeatmap, getDepartmentTrainingInsights } from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department') || undefined;

    const heatmap = await getDepartmentSkillHeatmap();
    const insights = await getDepartmentTrainingInsights(department);

    return NextResponse.json({
      success: true,
      heatmap,
      insights,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
