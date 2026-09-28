import { NextResponse } from 'next/server';
import { submitAssessmentAttempt } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const { selectedAnswers } = body;
    if (!Array.isArray(selectedAnswers)) {
      return NextResponse.json(
        { error: 'selectedAnswers array is required.' },
        { status: 400 }
      );
    }

    const result = await submitAssessmentAttempt({
      assessmentId: id,
      traineeId: session.id,
      selectedAnswers,
    });

    return NextResponse.json({
      success: true,
      attempt: result.attempt,
      certificate: result.certificate,
      message: result.attempt.passed
        ? 'Congratulations! You passed the assessment and your digital certificate has been issued.'
        : 'Assessment completed. Passing benchmark was not achieved. You may review explanations and retry.',
    });
  } catch (error: any) {
    console.error('Assessment submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
