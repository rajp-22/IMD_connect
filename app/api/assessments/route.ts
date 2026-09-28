import { NextResponse } from 'next/server';
import { getAssessments, createAssessment } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId') || undefined;
    const assessments = await getAssessments(courseId);
    return NextResponse.json({ success: true, assessments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== 'trainer' && session.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Only trainers and administrators can author assessments.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (!body.courseId || !body.questions || !body.questions.length) {
      return NextResponse.json(
        { error: 'courseId and at least one question are required.' },
        { status: 400 }
      );
    }

    const assessment = await createAssessment({
      ...body,
      trainerId: session.id,
      trainerName: session.name,
    });

    return NextResponse.json({ success: true, assessment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
