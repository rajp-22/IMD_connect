import { NextResponse } from 'next/server';
import {
  getTrainingEvents,
  createTrainingEvent,
  updateTrainingEvent,
  deleteTrainingEvent,
  toggleEventCompletion,
  addPersonalReminder,
  detectCalendarConflicts,
} from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const role = searchParams.get('role') || undefined;

    const events = await getTrainingEvents(userId, role);
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createTrainingEvent(body);
    return NextResponse.json({
      success: true,
      event: result.event,
      conflicts: result.conflicts,
      hasConflict: result.conflicts.length > 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, _id, ...updates } = body;
    const targetId = id || _id;
    if (!targetId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const updated = await updateTrainingEvent(targetId, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const success = await deleteTrainingEvent(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { action, eventId, userId, remindBefore, note } = body;

    if (action === 'toggle_complete') {
      const res = await toggleEventCompletion(eventId, userId);
      return NextResponse.json({ success: true, ...res });
    }

    if (action === 'set_reminder') {
      const updated = await addPersonalReminder(eventId, userId, remindBefore, note);
      return NextResponse.json({ success: true, event: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
