import { NextResponse } from 'next/server';
import { getTrainingEvents, createTrainingEvent } from '@/lib/data-service';

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
    const event = await createTrainingEvent(body);
    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
