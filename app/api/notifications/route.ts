import { NextResponse } from 'next/server';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr_trainee_001';

    const notifications = await getNotifications(userId);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, userId, markAll } = body;

    if (markAll && userId) {
      await markAllNotificationsAsRead(userId);
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (id) {
      const updated = await markNotificationAsRead(id);
      return NextResponse.json({ success: true, updated });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
