import { NextResponse } from 'next/server';
import { getCourses, createCourse } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const search = searchParams.get('search') || undefined;
    const trainerId = searchParams.get('trainerId') || undefined;

    const courses = await getCourses({ category, difficulty, search, trainerId });
    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== 'trainer' && session.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Only approved trainers and administrators can create courses.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Course title and description are required.' },
        { status: 400 }
      );
    }

    const course = await createCourse({
      ...body,
      trainerId: session.id,
      trainerName: session.name,
      trainerRole: session.designation || 'Certified IMD Instructor',
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
