import { NextResponse } from 'next/server';
import { getFeedbacks, createFeedback } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId') || undefined;
    const feedbacks = await getFeedbacks(courseId);
    return NextResponse.json({ success: true, feedbacks });
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

    const { courseId, rating, comments } = await req.json();
    if (!courseId || !rating || !comments) {
      return NextResponse.json(
        { error: 'courseId, rating (1-5), and comments are required.' },
        { status: 400 }
      );
    }

    const feedback = await createFeedback({
      courseId,
      traineeId: session.id,
      rating: Number(rating),
      comments,
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully.',
      feedback,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
