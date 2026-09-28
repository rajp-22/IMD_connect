import { NextResponse } from 'next/server';
import { calculateTrainerCompetencyMatches } from '@/lib/data-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { requiredCompetencies } = body;

    const matches = await calculateTrainerCompetencyMatches(
      Array.isArray(requiredCompetencies) ? requiredCompetencies : []
    );

    return NextResponse.json({
      success: true,
      requiredCompetencies: requiredCompetencies || ['Meteorology', 'Weather Forecasting', 'Data Analysis'],
      matches,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const comps = searchParams.get('competencies');
    const requiredCompetencies = comps
      ? comps.split(',').map((c) => c.trim())
      : ['Meteorology', 'Weather Forecasting', 'Data Analysis'];

    const matches = await calculateTrainerCompetencyMatches(requiredCompetencies);

    return NextResponse.json({
      success: true,
      requiredCompetencies,
      matches,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
