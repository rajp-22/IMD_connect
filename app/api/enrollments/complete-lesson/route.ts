import { NextResponse } from 'next/server';
import { completeLesson } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { courseId, lessonId } = await req.json();
    if (!courseId || !lessonId) {
      return NextResponse.json(
        { error: 'courseId and lessonId are required' },
        { status: 400 }
      );
    }

    const enrollment = await completeLesson(courseId, lessonId, session.id);
    return NextResponse.json({
      success: true,
      message: 'Lesson marked as complete',
      enrollment,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
