import { NextResponse } from 'next/server';
import { getCourseById, getAssessmentById } from '@/lib/data-service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await getCourseById(id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    let assessment = null;
    if (course.assessmentId) {
      assessment = await getAssessmentById(course.assessmentId);
    }

    return NextResponse.json({ success: true, course, assessment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
