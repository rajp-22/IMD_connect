import { NextResponse } from 'next/server';
import { getAnnouncements, createAnnouncement } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const announcements = await getAnnouncements();
    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only administrators can post official announcements.' },
        { status: 403 }
      );
    }

    const { title, content, type, targetRole, priority } = await req.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required.' },
        { status: 400 }
      );
    }

    const announcement = await createAnnouncement({
      title,
      content,
      type: type || 'general',
      targetRole: targetRole || 'all',
      priority: priority || 'normal',
      author: session.name,
    });

    return NextResponse.json({ success: true, announcement }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
