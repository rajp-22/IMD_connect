import { NextResponse } from 'next/server';
import { getEnrollments, enrollTrainee } from '@/lib/data-service';
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

    const enrollments = await getEnrollments(traineeId);
    return NextResponse.json({ success: true, enrollments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const enrollment = await enrollTrainee(courseId, session.id);
    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in course.',
      enrollment,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
